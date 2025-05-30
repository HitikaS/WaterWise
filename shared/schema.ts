import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { z } from "zod";

// Session storage table for authentication
export const sessions = sqliteTable(
  "sessions",
  {
    sid: text("sid").primaryKey(),
    sess: text("sess").notNull(),
    expire: integer("expire", { mode: "timestamp" }).notNull(),
  }
);

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  waterSaved: integer("water_saved").default(0),
  actionsCount: integer("actions_count").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).defaultNow()
});

export const waterReports = sqliteTable("water_reports", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  issueType: text("issue_type").notNull(),
  severity: text("severity").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  userId: integer("user_id"),
  userName: text("user_name"),
  status: text("status").default("open"),
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
});

export const weatherData = sqliteTable("weather_data", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  temperature: real("temperature").notNull(),
  rainfall: real("rainfall").notNull(),
  humidity: real("humidity").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
});

export const predictions = sqliteTable("predictions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  week: integer("week").notNull(),
  riskLevel: real("risk_level").notNull(),
  expectedRainfall: real("expected_rainfall").notNull(),
  temperature: real("temperature").notNull(),
  userReportsCount: integer("user_reports_count").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).defaultNow(),
});

export const waterTips = sqliteTable("water_tips", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  waterSaving: real("water_saving").notNull(),
  category: text("category").notNull(),
  isActive: integer("is_active").default(1),
});

// Explicit Zod schemas for inserts
export const insertUserSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profileImageUrl: z.string().optional(),
  waterSaved: z.number().optional(),
  actionsCount: z.number().optional(),
  updatedAt: z.number().optional(),
});

export const insertWaterReportSchema = z.object({
  issueType: z.string(),
  severity: z.string(),
  location: z.string(),
  description: z.string(),
  userId: z.number().optional(),
  userName: z.string().optional(),
});

export const insertWeatherDataSchema = z.object({
  date: z.string(),
  temperature: z.number(),
  rainfall: z.number(),
  humidity: z.number(),
  description: z.string(),
  icon: z.string(),
});

export const insertPredictionSchema = z.object({
  week: z.number(),
  riskLevel: z.number(),
  expectedRainfall: z.number(),
  temperature: z.number(),
  userReportsCount: z.number(),
});

export const insertWaterTipSchema = z.object({
  title: z.string(),
  description: z.string(),
  waterSaving: z.number(),
  category: z.string(),
  isActive: z.number().optional(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = Omit<InsertUser, "id"> & { id?: string };
export type WaterReport = typeof waterReports.$inferSelect;
export type InsertWaterReport = z.infer<typeof insertWaterReportSchema>;
export type WeatherData = typeof weatherData.$inferSelect;
export type InsertWeatherData = z.infer<typeof insertWeatherDataSchema>;
export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type WaterTip = typeof waterTips.$inferSelect;
export type InsertWaterTip = z.infer<typeof insertWaterTipSchema>;
