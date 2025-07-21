import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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

export const diseases = pgTable("diseases", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  symptoms: text("symptoms").array(),
  seasonalPattern: text("seasonal_pattern"),
  transmissionType: text("transmission_type"),
  incubationPeriod: text("incubation_period"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const medicines = pgTable("medicines", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  dosage: text("dosage"),
  contraindications: text("contraindications").array(),
  stockLevel: text("stock_level").notNull().default("medium"), // low, medium, high
  diseaseId: integer("disease_id").references(() => diseases.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  diseaseId: integer("disease_id").references(() => diseases.id).notNull(),
  region: text("region").notNull(),
  confidence: real("confidence").notNull(),
  timeframe: text("timeframe").notNull(),
  riskLevel: text("risk_level").notNull(), // low, medium, high, critical
  environmentalFactors: jsonb("environmental_factors"),
  aiAnalysis: text("ai_analysis"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  predictionId: integer("prediction_id").references(() => predictions.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull(), // info, warning, critical
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const environmentalData = pgTable("environmental_data", {
  id: serial("id").primaryKey(),
  region: text("region").notNull(),
  temperature: real("temperature"),
  humidity: real("humidity"),
  airQuality: text("air_quality"),
  populationDensity: text("population_density"),
  data: jsonb("data"),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  type: text("type").notNull(), // prediction, trend, alert
  data: jsonb("data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  alerts: many(alerts),
  reports: many(reports),
}));

export const diseasesRelations = relations(diseases, ({ many }) => ({
  medicines: many(medicines),
  predictions: many(predictions),
}));

export const medicinesRelations = relations(medicines, ({ one }) => ({
  disease: one(diseases, {
    fields: [medicines.diseaseId],
    references: [diseases.id],
  }),
}));

export const predictionsRelations = relations(predictions, ({ one, many }) => ({
  disease: one(diseases, {
    fields: [predictions.diseaseId],
    references: [diseases.id],
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

export const insertDiseaseSchema = createInsertSchema(diseases).omit({
  id: true,
  createdAt: true,
});

export const insertMedicineSchema = createInsertSchema(medicines).omit({
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

export const insertEnvironmentalDataSchema = createInsertSchema(environmentalData).omit({
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
export type Disease = typeof diseases.$inferSelect;
export type InsertDisease = z.infer<typeof insertDiseaseSchema>;
export type Medicine = typeof medicines.$inferSelect;
export type InsertMedicine = z.infer<typeof insertMedicineSchema>;
export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type EnvironmentalData = typeof environmentalData.$inferSelect;
export type InsertEnvironmentalData = z.infer<typeof insertEnvironmentalDataSchema>;
export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;
