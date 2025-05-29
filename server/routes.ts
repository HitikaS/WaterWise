import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaterReportSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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
      const apiKey = process.env.OPENWEATHER_API_KEY || process.env.VITE_OPENWEATHER_API_KEY;
      
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
      
      // Process and store weather data
      const weatherEntries = data.list.slice(0, 5).map((item: any) => ({
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

      res.json(weatherEntries);
    } catch (error) {
      console.error("Weather fetch error:", error);
      res.status(500).json({ message: "Failed to fetch weather data from API" });
    }
  });

  // Predictions
  app.get("/api/predictions", async (req, res) => {
    try {
      const predictions = await storage.getPredictions();
      res.json(predictions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch predictions" });
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
      const userId = parseInt(req.params.id);
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
