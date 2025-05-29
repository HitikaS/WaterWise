import { 
  users, 
  waterReports, 
  weatherData, 
  predictions, 
  waterTips,
  type User, 
  type InsertUser,
  type UpsertUser,
  type WaterReport,
  type InsertWaterReport,
  type WeatherData,
  type InsertWeatherData,
  type Prediction,
  type InsertPrediction,
  type WaterTip,
  type InsertWaterTip
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Users (required for auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Water Reports
  createWaterReport(report: InsertWaterReport): Promise<WaterReport>;
  getWaterReports(): Promise<WaterReport[]>;
  getWaterReportsByDate(date: string): Promise<WaterReport[]>;
  getWaterReportById(id: number): Promise<WaterReport | undefined>;
  updateWaterReportStatus(id: number, status: string): Promise<WaterReport | undefined>;

  // Weather Data
  createWeatherData(weather: InsertWeatherData): Promise<WeatherData>;
  getWeatherData(): Promise<WeatherData[]>;
  getLatestWeatherData(): Promise<WeatherData | undefined>;

  // Predictions
  createPrediction(prediction: InsertPrediction): Promise<Prediction>;
  getPredictions(): Promise<Prediction[]>;
  getLatestPredictions(): Promise<Prediction[]>;

  // Water Tips
  createWaterTip(tip: InsertWaterTip): Promise<WaterTip>;
  getWaterTips(): Promise<WaterTip[]>;
  getActiveWaterTips(): Promise<WaterTip[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(users.waterSaved);
  }

  // Water Reports
  async createWaterReport(insertReport: InsertWaterReport): Promise<WaterReport> {
    const [report] = await db
      .insert(waterReports)
      .values({
        ...insertReport,
        status: "open",
      })
      .returning();
    return report;
  }

  async getWaterReports(): Promise<WaterReport[]> {
    return await db.select().from(waterReports).orderBy(waterReports.createdAt);
  }

  async getWaterReportsByDate(date: string): Promise<WaterReport[]> {
    const reports = await db.select().from(waterReports);
    return reports.filter(report => 
      report.createdAt && report.createdAt.toISOString().split('T')[0] === date
    );
  }

  async getWaterReportById(id: number): Promise<WaterReport | undefined> {
    const [report] = await db.select().from(waterReports).where(eq(waterReports.id, id));
    return report;
  }

  async updateWaterReportStatus(id: number, status: string): Promise<WaterReport | undefined> {
    const [report] = await db
      .update(waterReports)
      .set({ status })
      .where(eq(waterReports.id, id))
      .returning();
    return report;
  }

  // Weather Data
  async createWeatherData(insertWeather: InsertWeatherData): Promise<WeatherData> {
    const [weather] = await db
      .insert(weatherData)
      .values(insertWeather)
      .returning();
    return weather;
  }

  async getWeatherData(): Promise<WeatherData[]> {
    return await db.select().from(weatherData).orderBy(weatherData.date);
  }

  async getLatestWeatherData(): Promise<WeatherData | undefined> {
    const weather = await db.select().from(weatherData).orderBy(weatherData.date);
    return weather[weather.length - 1];
  }

  // Predictions
  async createPrediction(insertPrediction: InsertPrediction): Promise<Prediction> {
    const [prediction] = await db
      .insert(predictions)
      .values(insertPrediction)
      .returning();
    return prediction;
  }

  async getPredictions(): Promise<Prediction[]> {
    return await db.select().from(predictions).orderBy(predictions.week);
  }

  async getLatestPredictions(): Promise<Prediction[]> {
    return await db.select().from(predictions).orderBy(predictions.week);
  }

  // Water Tips
  async createWaterTip(insertTip: InsertWaterTip): Promise<WaterTip> {
    const [tip] = await db
      .insert(waterTips)
      .values(insertTip)
      .returning();
    return tip;
  }

  async getWaterTips(): Promise<WaterTip[]> {
    return await db.select().from(waterTips);
  }

  async getActiveWaterTips(): Promise<WaterTip[]> {
    const tips = await db.select().from(waterTips);
    return tips.filter(tip => tip.isActive);
  }
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private waterReports: Map<number, WaterReport> = new Map();
  private weatherData: Map<number, WeatherData> = new Map();
  private predictions: Map<number, Prediction> = new Map();
  private waterTips: Map<number, WaterTip> = new Map();
  
  private currentReportId = 1;
  private currentWeatherId = 1;
  private currentPredictionId = 1;
  private currentTipId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize default user
    this.createUser({
      username: "John Doe",
      email: "john@example.com",
      waterSaved: 950,
      actionsCount: 6
    });

    // Initialize sample users for leaderboard
    this.createUser({
      username: "Sarah Chen",
      email: "sarah@example.com",
      waterSaved: 2340,
      actionsCount: 15
    });

    this.createUser({
      username: "Mike Johnson",
      email: "mike@example.com",
      waterSaved: 1890,
      actionsCount: 12
    });

    this.createUser({
      username: "Emma Davis",
      email: "emma@example.com",
      waterSaved: 1650,
      actionsCount: 10
    });

    // Initialize water tips
    this.createWaterTip({
      title: "Fix Leaky Faucets",
      description: "A dripping faucet can waste over 3,000 gallons per year.",
      waterSaving: 30,
      category: "maintenance",
      isActive: true
    });

    this.createWaterTip({
      title: "Short Showers",
      description: "Reduce shower time by 2 minutes to save significant water.",
      waterSaving: 40,
      category: "daily",
      isActive: true
    });

    this.createWaterTip({
      title: "Collect Rainwater",
      description: "Use buckets or barrels to collect rainwater for plants.",
      waterSaving: 50,
      category: "conservation",
      isActive: true
    });

    // Initialize sample weather data
    const today = new Date();
    this.createWeatherData({
      date: today.toISOString().split('T')[0],
      temperature: 34,
      rainfall: 0,
      humidity: 65,
      description: "Sunny, No Rain",
      icon: "sun"
    });

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.createWeatherData({
      date: tomorrow.toISOString().split('T')[0],
      temperature: 31,
      rainfall: 2,
      humidity: 70,
      description: "Cloudy",
      icon: "cloud"
    });

    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);
    this.createWeatherData({
      date: dayAfter.toISOString().split('T')[0],
      temperature: 28,
      rainfall: 15,
      humidity: 80,
      description: "Light Rain",
      icon: "cloud-rain"
    });

    // Initialize predictions
    this.createPrediction({
      week: 1,
      riskLevel: 65,
      expectedRainfall: 45,
      temperature: 32,
      userReportsCount: 12
    });

    this.createPrediction({
      week: 2,
      riskLevel: 78,
      expectedRainfall: 23,
      temperature: 34,
      userReportsCount: 18
    });

    this.createPrediction({
      week: 3,
      riskLevel: 82,
      expectedRainfall: 15,
      temperature: 36,
      userReportsCount: 25
    });

    this.createPrediction({
      week: 4,
      riskLevel: 75,
      expectedRainfall: 35,
      temperature: 33,
      userReportsCount: 20
    });

    // Initialize sample reports
    this.createWaterReport({
      issueType: "No Water Supply",
      severity: "High",
      location: "Downtown Area",
      description: "Complete water outage in the downtown area affecting multiple buildings.",
      userId: 1,
      userName: "Anonymous"
    });

    this.createWaterReport({
      issueType: "Low Water Pressure",
      severity: "Medium",
      location: "Residential Block B",
      description: "Water pressure has been consistently low for the past few days.",
      userId: 2,
      userName: "Maria S."
    });

    this.createWaterReport({
      issueType: "Water Quality Issues",
      severity: "Low",
      location: "Park Avenue",
      description: "Water appears cloudy and has an unusual taste.",
      userId: 3,
      userName: "John M."
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values()).sort((a, b) => (b.waterSaved || 0) - (a.waterSaved || 0));
  }

  // Water Reports
  async createWaterReport(insertReport: InsertWaterReport): Promise<WaterReport> {
    const id = this.currentReportId++;
    const report: WaterReport = {
      ...insertReport,
      id,
      status: "open",
      createdAt: new Date()
    };
    this.waterReports.set(id, report);
    return report;
  }

  async getWaterReports(): Promise<WaterReport[]> {
    return Array.from(this.waterReports.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getWaterReportsByDate(date: string): Promise<WaterReport[]> {
    const reports = Array.from(this.waterReports.values());
    return reports.filter(report => 
      report.createdAt && report.createdAt.toISOString().split('T')[0] === date
    );
  }

  async getWaterReportById(id: number): Promise<WaterReport | undefined> {
    return this.waterReports.get(id);
  }

  async updateWaterReportStatus(id: number, status: string): Promise<WaterReport | undefined> {
    const report = this.waterReports.get(id);
    if (!report) return undefined;

    const updatedReport = { ...report, status };
    this.waterReports.set(id, updatedReport);
    return updatedReport;
  }

  // Weather Data
  async createWeatherData(insertWeather: InsertWeatherData): Promise<WeatherData> {
    const id = this.currentWeatherId++;
    const weather: WeatherData = {
      ...insertWeather,
      id,
      createdAt: new Date()
    };
    this.weatherData.set(id, weather);
    return weather;
  }

  async getWeatherData(): Promise<WeatherData[]> {
    return Array.from(this.weatherData.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  async getLatestWeatherData(): Promise<WeatherData | undefined> {
    const weatherArray = Array.from(this.weatherData.values());
    return weatherArray.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
  }

  // Predictions
  async createPrediction(insertPrediction: InsertPrediction): Promise<Prediction> {
    const id = this.currentPredictionId++;
    const prediction: Prediction = {
      ...insertPrediction,
      id,
      createdAt: new Date()
    };
    this.predictions.set(id, prediction);
    return prediction;
  }

  async getPredictions(): Promise<Prediction[]> {
    return Array.from(this.predictions.values()).sort((a, b) => a.week - b.week);
  }

  async getLatestPredictions(): Promise<Prediction[]> {
    return this.getPredictions();
  }

  // Water Tips
  async createWaterTip(insertTip: InsertWaterTip): Promise<WaterTip> {
    const id = this.currentTipId++;
    const tip: WaterTip = {
      ...insertTip,
      id
    };
    this.waterTips.set(id, tip);
    return tip;
  }

  async getWaterTips(): Promise<WaterTip[]> {
    return Array.from(this.waterTips.values());
  }

  async getActiveWaterTips(): Promise<WaterTip[]> {
    return Array.from(this.waterTips.values()).filter(tip => tip.isActive);
  }
}

export const storage = new DatabaseStorage();
