import { pgTable, text, serial, integer, boolean, timestamp, real, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  username: text("username").notNull().unique(),
  waterSaved: real("water_saved").default(0),
  actionsCount: integer("actions_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const waterReports = pgTable("water_reports", {
  id: serial("id").primaryKey(),
  issueType: text("issue_type").notNull(),
  severity: text("severity").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  userId: integer("user_id"),
  userName: text("user_name"),
  status: text("status").default("open"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const weatherData = pgTable("weather_data", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  temperature: real("temperature").notNull(),
  rainfall: real("rainfall").notNull(),
  humidity: real("humidity").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  week: integer("week").notNull(),
  riskLevel: real("risk_level").notNull(),
  expectedRainfall: real("expected_rainfall").notNull(),
  temperature: real("temperature").notNull(),
  userReportsCount: integer("user_reports_count").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const waterTips = pgTable("water_tips", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  waterSaving: real("water_saving").notNull(),
  category: text("category").notNull(),
  isActive: boolean("is_active").default(true),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertWaterReportSchema = createInsertSchema(waterReports).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertWeatherDataSchema = createInsertSchema(weatherData).omit({
  id: true,
  createdAt: true,
});

export const insertPredictionSchema = createInsertSchema(predictions).omit({
  id: true,
  createdAt: true,
});

export const insertWaterTipSchema = createInsertSchema(waterTips).omit({
  id: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type WaterReport = typeof waterReports.$inferSelect;
export type InsertWaterReport = z.infer<typeof insertWaterReportSchema>;
export type WeatherData = typeof weatherData.$inferSelect;
export type InsertWeatherData = z.infer<typeof insertWeatherDataSchema>;
export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type WaterTip = typeof waterTips.$inferSelect;
export type InsertWaterTip = z.infer<typeof insertWaterTipSchema>;
