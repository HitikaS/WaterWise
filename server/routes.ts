import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaterReportSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple demo authentication
  app.get('/api/login', (req, res) => {
    // For demo purposes, create a simple login
    const demoUser = {
      id: 'demo-user-1',
      username: 'Demo User',
      email: 'demo@aquaid.com',
      firstName: 'Demo',
      lastName: 'User',
      profileImageUrl: null
    };
    
    // Store user in session
    (req as any).session = (req as any).session || {};
    (req as any).session.user = demoUser;
    
    // Redirect to home
    res.redirect('/');
  });

  app.get('/api/logout', (req, res) => {
    if ((req as any).session) {
      (req as any).session.destroy();
    }
    res.redirect('/');
  });

  app.get('/api/auth/user', async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user;
      if (!sessionUser) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Try to get user from storage, or create if doesn't exist
      let user = await storage.getUser(sessionUser.id);
      if (!user) {
        user = await storage.upsertUser({
          id: sessionUser.id,
          username: sessionUser.username,
          email: sessionUser.email,
          firstName: sessionUser.firstName,
          lastName: sessionUser.lastName,
          profileImageUrl: sessionUser.profileImageUrl
        });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard metrics
  app.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const reports = await storage.getWaterReports();
      const todayReports = await storage.getWaterReportsByDate(new Date().toISOString().split('T')[0]);
      const latestWeather = await storage.getLatestWeatherData();
      const predictions = await storage.getLatestPredictions();
      
      const currentRisk = predictions.length > 0 ? predictions[0].riskLevel : 78;
      const expectedRainfall = predictions.length > 0 ? predictions[0].expectedRainfall : 23;
      
      res.json({
        currentRisk,
        expectedRainfall,
        reportsToday: todayReports.length,
        temperature: latestWeather?.temperature || 34
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  // Weather data
  app.get("/api/weather", async (req, res) => {
    try {
      const weatherData = await storage.getWeatherData();
      res.json(weatherData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weather data" });
    }
  });

  // Fetch weather from OpenWeatherMap API
  app.get("/api/weather/fetch", async (req, res) => {
    try {
      const apiKey = process.env.OPENWEATHER_API_KEY;
      
      if (!apiKey) {
        return res.status(400).json({ message: "OpenWeatherMap API key not configured" });
      }

      const city = req.query.city || "London";
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Process and store weather data for next 7 days
      const weatherEntries = data.list.slice(0, 8).map((item: any, index: number) => ({
        date: new Date(item.dt * 1000).toISOString().split('T')[0],
        temperature: Math.round(item.main.temp),
        rainfall: item.rain?.['3h'] || 0,
        humidity: item.main.humidity,
        description: item.weather[0].description,
        icon: item.weather[0].icon
      }));

      // Clear old weather data and store new
      const allWeather = await storage.getWeatherData();
      
      // Store weather data
      for (const weather of weatherEntries) {
        await storage.createWeatherData(weather);
      }

      // Generate predictions based on real weather data
      await generatePredictionsFromWeather(weatherEntries);

      res.json(weatherEntries);
    } catch (error) {
      console.error("Weather fetch error:", error);
      res.status(500).json({ message: "Failed to fetch weather data from API" });
    }
  });

  // Auto-fetch weather data on startup for default location
  app.post("/api/init-weather", async (req, res) => {
    try {
      const apiKey = process.env.OPENWEATHER_API_KEY;
      
      if (!apiKey) {
        return res.status(400).json({ message: "OpenWeatherMap API key not configured" });
      }

      const city = req.body.city || "London";
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Process and store weather data
      const weatherEntries = data.list.slice(0, 8).map((item: any) => ({
        date: new Date(item.dt * 1000).toISOString().split('T')[0],
        temperature: Math.round(item.main.temp),
        rainfall: item.rain?.['3h'] || 0,
        humidity: item.main.humidity,
        description: item.weather[0].description,
        icon: item.weather[0].icon
      }));

      // Store weather data
      for (const weather of weatherEntries) {
        await storage.createWeatherData(weather);
      }

      // Generate realistic predictions based on weather
      await generatePredictionsFromWeather(weatherEntries);

      res.json({ message: "Weather data initialized successfully", weatherEntries });
    } catch (error) {
      console.error("Weather initialization error:", error);
      res.status(500).json({ message: "Failed to initialize weather data" });
    }
  });

  async function generatePredictionsFromWeather(weatherData: any[]) {
    const reports = await storage.getWaterReports();
    
    // Calculate averages from real weather data
    const avgRainfall = weatherData.reduce((sum, w) => sum + w.rainfall, 0) / weatherData.length;
    const avgTemp = weatherData.reduce((sum, w) => sum + w.temperature, 0) / weatherData.length;
    
    const predictions = [];
    
    for (let week = 1; week <= 4; week++) {
      const baseRisk = 45;
      let riskModifier = 0;
      
      // Weather impact on water scarcity risk
      if (avgRainfall < 10) riskModifier += 25; // Very low rainfall
      else if (avgRainfall < 20) riskModifier += 15; // Low rainfall
      else if (avgRainfall > 50) riskModifier -= 10; // High rainfall
      
      if (avgTemp > 35) riskModifier += 20; // Very high temperature
      else if (avgTemp > 30) riskModifier += 10; // High temperature
      else if (avgTemp < 20) riskModifier -= 5; // Cooler weather
      
      // User reports impact
      const recentReports = reports.filter(r => 
        r.createdAt && new Date(r.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
      );
      riskModifier += Math.min(recentReports.length * 5, 25);
      
      // Week progression
      riskModifier += (week - 1) * 5;
      
      const riskLevel = Math.min(Math.max(baseRisk + riskModifier, 0), 100);
      const expectedRainfall = Math.max(avgRainfall - (week * 3), 0);
      
      const prediction = await storage.createPrediction({
        week,
        riskLevel,
        expectedRainfall,
        temperature: avgTemp + (week * 1),
        userReportsCount: recentReports.length
      });
      
      predictions.push(prediction);
    }
    
    return predictions;
  }

  // Predictions
  app.get("/api/predictions", async (req, res) => {
    try {
      const predictions = await storage.getPredictions();
      res.json(predictions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch predictions" });
    }
  });

  // Initialize sample data for demo
  app.post("/api/init-sample-data", async (req, res) => {
    try {
      // Add sample weather data
      const sampleWeatherData = [
        { date: new Date().toISOString().split('T')[0], temperature: 34, rainfall: 0, humidity: 65, description: "sunny", icon: "01d" },
        { date: new Date(Date.now() + 86400000).toISOString().split('T')[0], temperature: 36, rainfall: 2, humidity: 58, description: "partly cloudy", icon: "02d" },
        { date: new Date(Date.now() + 172800000).toISOString().split('T')[0], temperature: 32, rainfall: 15, humidity: 72, description: "light rain", icon: "10d" },
        { date: new Date(Date.now() + 259200000).toISOString().split('T')[0], temperature: 28, rainfall: 25, humidity: 80, description: "rain", icon: "10d" },
        { date: new Date(Date.now() + 345600000).toISOString().split('T')[0], temperature: 30, rainfall: 8, humidity: 70, description: "cloudy", icon: "04d" }
      ];

      for (const weather of sampleWeatherData) {
        await storage.createWeatherData(weather);
      }

      // Add sample predictions
      const samplePredictions = [
        { week: 1, riskLevel: 78, expectedRainfall: 23, temperature: 34, userReportsCount: 1 },
        { week: 2, riskLevel: 85, expectedRainfall: 18, temperature: 36, userReportsCount: 2 },
        { week: 3, riskLevel: 92, expectedRainfall: 12, temperature: 38, userReportsCount: 3 },
        { week: 4, riskLevel: 95, expectedRainfall: 8, temperature: 40, userReportsCount: 4 }
      ];

      for (const prediction of samplePredictions) {
        await storage.createPrediction(prediction);
      }

      // Add sample water tips
      const sampleTips = [
        { title: "Fix Leaky Faucets", description: "A dripping faucet can waste over 3,000 gallons per year", waterSaving: 3000, category: "Indoor", isActive: true },
        { title: "Shorter Showers", description: "Reduce shower time by 2 minutes to save 10 gallons per shower", waterSaving: 10, category: "Indoor", isActive: true },
        { title: "Rain Water Harvesting", description: "Collect rainwater for garden irrigation", waterSaving: 500, category: "Outdoor", isActive: true }
      ];

      for (const tip of sampleTips) {
        await storage.createWaterTip(tip);
      }

      res.json({ message: "Sample data initialized successfully" });
    } catch (error) {
      console.error("Sample data initialization error:", error);
      res.status(500).json({ message: "Failed to initialize sample data" });
    }
  });

  // Generate new predictions based on weather and reports
  app.post("/api/predictions/generate", async (req, res) => {
    try {
      const weatherData = await storage.getWeatherData();
      const reports = await storage.getWaterReports();
      
      // Simple ML-like algorithm for prediction
      const predictions = [];
      
      for (let week = 1; week <= 4; week++) {
        const baseRisk = 60;
        let riskModifier = 0;
        
        // Weather impact
        const avgRainfall = weatherData.reduce((sum, w) => sum + w.rainfall, 0) / weatherData.length;
        const avgTemp = weatherData.reduce((sum, w) => sum + w.temperature, 0) / weatherData.length;
        
        if (avgRainfall < 20) riskModifier += 15; // Low rainfall increases risk
        if (avgTemp > 30) riskModifier += 10; // High temperature increases risk
        
        // Reports impact
        const recentReports = reports.filter(r => 
          r.createdAt && new Date(r.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
        );
        riskModifier += Math.min(recentReports.length * 2, 20);
        
        // Week progression (risk typically increases over time without rain)
        riskModifier += (week - 1) * 3;
        
        const riskLevel = Math.min(Math.max(baseRisk + riskModifier, 0), 100);
        const expectedRainfall = Math.max(avgRainfall - (week * 5), 0);
        
        const prediction = await storage.createPrediction({
          week,
          riskLevel,
          expectedRainfall,
          temperature: avgTemp + (week * 0.5),
          userReportsCount: recentReports.length
        });
        
        predictions.push(prediction);
      }
      
      res.json(predictions);
    } catch (error) {
      console.error("Prediction generation error:", error);
      res.status(500).json({ message: "Failed to generate predictions" });
    }
  });

  // Water reports
  app.get("/api/reports", async (req, res) => {
    try {
      const reports = await storage.getWaterReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch water reports" });
    }
  });

  app.post("/api/reports", async (req, res) => {
    try {
      const reportData = insertWaterReportSchema.parse(req.body);
      const report = await storage.createWaterReport(reportData);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid report data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create water report" });
      }
    }
  });

  // Water tips
  app.get("/api/tips", async (req, res) => {
    try {
      const tips = await storage.getActiveWaterTips();
      res.json(tips);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch water tips" });
    }
  });

  // Leaderboard
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Update user water savings
  app.post("/api/users/:id/water-saved", async (req, res) => {
    try {
      const userId = req.params.id; // Keep as string for consistency
      const { waterSaved, actionsCount } = req.body;
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const updatedUser = await storage.updateUser(userId, {
        waterSaved: (user.waterSaved || 0) + waterSaved,
        actionsCount: (user.actionsCount || 0) + actionsCount
      });
      
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user water savings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
