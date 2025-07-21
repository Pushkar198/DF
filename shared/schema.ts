import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table with sector support
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("user"), // user, admin
  sector: text("sector").notNull(), // healthcare, automobile, agriculture
  region: text("region").notNull(),
  organization: text("organization"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Sector configurations table
export const sectors = pgTable("sectors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // healthcare, automobile, agriculture
  displayName: text("display_name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Generic demand items (replaces diseases, medicines with flexible products/items)
export const demandItems = pgTable("demand_items", {
  id: serial("id").primaryKey(),
  sector: text("sector").notNull(), // healthcare, automobile, agriculture
  name: text("name").notNull(),
  category: text("category").notNull(), // medicine/vehicle/seed, etc.
  subcategory: text("subcategory"), // tablet/syrup/injection, petrol/diesel/ev, fertilizer/pesticide
  description: text("description"),
  specifications: jsonb("specifications"), // age_group, dosage_form, vehicle_class, etc.
  seasonalPattern: text("seasonal_pattern"),
  factors: text("factors").array(), // factors affecting demand
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Flexible predictions table
export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  sector: text("sector").notNull(),
  itemId: integer("item_id").references(() => demandItems.id),
  region: text("region").notNull(),
  confidence: real("confidence").notNull(),
  timeframe: text("timeframe").notNull(),
  demandLevel: text("demand_level").notNull(), // low, medium, high, critical
  demandQuantity: integer("demand_quantity"), // estimated quantity
  environmentalFactors: jsonb("environmental_factors"),
  marketFactors: jsonb("market_factors"), // prices, policies, trends
  aiAnalysis: text("ai_analysis"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Alerts table
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  predictionId: integer("prediction_id").references(() => predictions.id),
  sector: text("sector").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull(), // info, warning, critical
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Environmental and market data
export const contextualData = pgTable("contextual_data", {
  id: serial("id").primaryKey(),
  sector: text("sector").notNull(),
  region: text("region").notNull(),
  dataType: text("data_type").notNull(), // environmental, market, social, news
  data: jsonb("data"),
  source: text("source"), // api, gemini, static
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});

// Reports table
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sector: text("sector").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(), // demand_forecast, trend_analysis, alert_summary
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  alerts: many(alerts),
  reports: many(reports),
}));

export const sectorsRelations = relations(sectors, ({ many }) => ({
  demandItems: many(demandItems),
}));

export const demandItemsRelations = relations(demandItems, ({ many }) => ({
  predictions: many(predictions),
}));

export const predictionsRelations = relations(predictions, ({ one, many }) => ({
  item: one(demandItems, {
    fields: [predictions.itemId],
    references: [demandItems.id],
  }),
  alerts: many(alerts),
}));

export const alertsRelations = relations(alerts, ({ one }) => ({
  user: one(users, {
    fields: [alerts.userId],
    references: [users.id],
  }),
  prediction: one(predictions, {
    fields: [alerts.predictionId],
    references: [predictions.id],
  }),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  user: one(users, {
    fields: [reports.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertSectorSchema = createInsertSchema(sectors).omit({
  id: true,
  createdAt: true,
});

export const insertDemandItemSchema = createInsertSchema(demandItems).omit({
  id: true,
  createdAt: true,
});

export const insertPredictionSchema = createInsertSchema(predictions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
});

export const insertContextualDataSchema = createInsertSchema(contextualData).omit({
  id: true,
  recordedAt: true,
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Sector = typeof sectors.$inferSelect;
export type InsertSector = z.infer<typeof insertSectorSchema>;
export type DemandItem = typeof demandItems.$inferSelect;
export type InsertDemandItem = z.infer<typeof insertDemandItemSchema>;
export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type ContextualData = typeof contextualData.$inferSelect;
export type InsertContextualData = z.infer<typeof insertContextualDataSchema>;
export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;

// Legacy types for backward compatibility
export type Disease = DemandItem;
export type Medicine = DemandItem;
export type EnvironmentalData = ContextualData;
export type InsertDisease = InsertDemandItem;
export type InsertMedicine = InsertDemandItem;
export type InsertEnvironmentalData = InsertContextualData;