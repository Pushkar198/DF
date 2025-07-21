import { 
  users, diseases, medicines, predictions, alerts, environmentalData, reports,
  type User, type InsertUser, type Disease, type InsertDisease, 
  type Medicine, type InsertMedicine, type Prediction, type InsertPrediction,
  type Alert, type InsertAlert, type EnvironmentalData, type InsertEnvironmentalData,
  type Report, type InsertReport
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Diseases
  getDiseases(): Promise<Disease[]>;
  getDiseaseById(id: number): Promise<Disease | undefined>;
  createDisease(disease: InsertDisease): Promise<Disease>;
  
  // Medicines
  getMedicines(): Promise<Medicine[]>;
  getMedicinesByDisease(diseaseId: number): Promise<Medicine[]>;
  createMedicine(medicine: InsertMedicine): Promise<Medicine>;
  
  // Predictions
  getPredictions(region?: string): Promise<Prediction[]>;
  getPredictionById(id: number): Promise<Prediction | undefined>;
  createPrediction(prediction: InsertPrediction): Promise<Prediction>;
  getRecentPredictions(region: string, limit?: number): Promise<Prediction[]>;
  
  // Alerts
  getAlerts(userId?: number): Promise<Alert[]>;
  getUnreadAlerts(userId: number): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  markAlertAsRead(id: number): Promise<void>;
  
  // Environmental Data
  getEnvironmentalData(region: string): Promise<EnvironmentalData | undefined>;
  createEnvironmentalData(data: InsertEnvironmentalData): Promise<EnvironmentalData>;
  
  // Reports
  getReports(userId?: number): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
  
  // Session store
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Diseases
  async getDiseases(): Promise<Disease[]> {
    return await db.select().from(diseases);
  }

  async getDiseaseById(id: number): Promise<Disease | undefined> {
    const [disease] = await db.select().from(diseases).where(eq(diseases.id, id));
    return disease || undefined;
  }

  async createDisease(insertDisease: InsertDisease): Promise<Disease> {
    const [disease] = await db
      .insert(diseases)
      .values(insertDisease)
      .returning();
    return disease;
  }

  // Medicines
  async getMedicines(): Promise<Medicine[]> {
    return await db.select().from(medicines);
  }

  async getMedicinesByDisease(diseaseId: number): Promise<Medicine[]> {
    return await db.select().from(medicines).where(eq(medicines.diseaseId, diseaseId));
  }

  async createMedicine(insertMedicine: InsertMedicine): Promise<Medicine> {
    const [medicine] = await db
      .insert(medicines)
      .values(insertMedicine)
      .returning();
    return medicine;
  }

  // Predictions
  async getPredictions(region?: string): Promise<Prediction[]> {
    const query = db.select().from(predictions).orderBy(desc(predictions.createdAt));
    
    if (region) {
      return await query.where(eq(predictions.region, region));
    }
    
    return await query;
  }

  async getPredictionById(id: number): Promise<Prediction | undefined> {
    const [prediction] = await db.select().from(predictions).where(eq(predictions.id, id));
    return prediction || undefined;
  }

  async createPrediction(insertPrediction: InsertPrediction): Promise<Prediction> {
    const [prediction] = await db
      .insert(predictions)
      .values(insertPrediction)
      .returning();
    return prediction;
  }

  async getRecentPredictions(region: string, limit: number = 10): Promise<Prediction[]> {
    return await db
      .select()
      .from(predictions)
      .where(eq(predictions.region, region))
      .orderBy(desc(predictions.createdAt))
      .limit(limit);
  }

  // Alerts
  async getAlerts(userId?: number): Promise<Alert[]> {
    const query = db.select().from(alerts).orderBy(desc(alerts.createdAt));
    
    if (userId) {
      return await query.where(eq(alerts.userId, userId));
    }
    
    return await query;
  }

  async getUnreadAlerts(userId: number): Promise<Alert[]> {
    return await db
      .select()
      .from(alerts)
      .where(and(eq(alerts.userId, userId), eq(alerts.isRead, false)))
      .orderBy(desc(alerts.createdAt));
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const [alert] = await db
      .insert(alerts)
      .values(insertAlert)
      .returning();
    return alert;
  }

  async markAlertAsRead(id: number): Promise<void> {
    await db
      .update(alerts)
      .set({ isRead: true })
      .where(eq(alerts.id, id));
  }

  // Environmental Data
  async getEnvironmentalData(region: string): Promise<EnvironmentalData | undefined> {
    const [data] = await db
      .select()
      .from(environmentalData)
      .where(eq(environmentalData.region, region))
      .orderBy(desc(environmentalData.recordedAt))
      .limit(1);
    return data || undefined;
  }

  async createEnvironmentalData(insertData: InsertEnvironmentalData): Promise<EnvironmentalData> {
    const [data] = await db
      .insert(environmentalData)
      .values(insertData)
      .returning();
    return data;
  }

  // Reports
  async getReports(userId?: number): Promise<Report[]> {
    const query = db.select().from(reports).orderBy(desc(reports.createdAt));
    
    if (userId) {
      return await query.where(eq(reports.userId, userId));
    }
    
    return await query;
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const [report] = await db
      .insert(reports)
      .values(insertReport)
      .returning();
    return report;
  }
}

export const storage = new DatabaseStorage();
