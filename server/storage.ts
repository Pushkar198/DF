import { db } from "./db";
import * as schema from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";
import ConnectPgSimple from "connect-pg-simple";
import session from "express-session";
import { pool } from "./db";
import type { 
  User, InsertUser, Sector, InsertSector, DemandItem, InsertDemandItem,
  Prediction, InsertPrediction, Alert, InsertAlert, ContextualData, InsertContextualData,
  Report, InsertReport 
} from "@shared/schema";

const {
  users, sectors, demandItems, predictions, alerts, contextualData, reports
} = schema;

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Sectors
  getSectors(): Promise<Sector[]>;
  getSectorByName(name: string): Promise<Sector | undefined>;
  createSector(sector: InsertSector): Promise<Sector>;
  
  // Demand Items (replaces diseases/medicines)
  getDemandItems(sector?: string): Promise<DemandItem[]>;
  getDemandItemById(id: number): Promise<DemandItem | undefined>;
  getDemandItemsByCategory(sector: string, category: string): Promise<DemandItem[]>;
  createDemandItem(item: InsertDemandItem): Promise<DemandItem>;
  
  // Predictions
  getPredictions(sector?: string, region?: string): Promise<Prediction[]>;
  getPredictionById(id: number): Promise<Prediction | undefined>;
  createPrediction(prediction: InsertPrediction): Promise<Prediction>;
  getRecentPredictions(sector: string, region: string, limit?: number): Promise<Prediction[]>;
  
  // Alerts
  getAlerts(userId?: number, sector?: string): Promise<Alert[]>;
  getUnreadAlerts(userId: number, sector?: string): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  markAlertAsRead(id: number): Promise<void>;
  
  // Contextual Data (replaces environmental data)
  getContextualData(sector: string, region: string, dataType?: string): Promise<ContextualData[]>;
  createContextualData(data: InsertContextualData): Promise<ContextualData>;
  
  // Reports
  getReports(userId?: number, sector?: string): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
  
  // Session store
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    const PgSession = ConnectPgSimple(session);
    this.sessionStore = new PgSession({
      pool: pool,
      tableName: "session",
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getSectors(): Promise<Sector[]> {
    return await db.select().from(sectors).where(eq(sectors.isActive, true));
  }

  async getSectorByName(name: string): Promise<Sector | undefined> {
    const result = await db.select().from(sectors).where(eq(sectors.name, name));
    return result[0];
  }

  async createSector(insertSector: InsertSector): Promise<Sector> {
    const result = await db.insert(sectors).values(insertSector).returning();
    return result[0];
  }

  async getDemandItems(sector?: string): Promise<DemandItem[]> {
    if (sector) {
      return await db.select().from(demandItems).where(eq(demandItems.sector, sector));
    }
    return await db.select().from(demandItems);
  }

  async getDemandItemById(id: number): Promise<DemandItem | undefined> {
    const result = await db.select().from(demandItems).where(eq(demandItems.id, id));
    return result[0];
  }

  async getDemandItemsByCategory(sector: string, category: string): Promise<DemandItem[]> {
    return await db.select().from(demandItems)
      .where(and(eq(demandItems.sector, sector), eq(demandItems.category, category)));
  }

  async createDemandItem(insertItem: InsertDemandItem): Promise<DemandItem> {
    const result = await db.insert(demandItems).values(insertItem).returning();
    return result[0];
  }

  async getPredictions(sector?: string, region?: string): Promise<Prediction[]> {
    let query = db.select().from(predictions);
    
    if (sector && region) {
      query = query.where(and(eq(predictions.sector, sector), eq(predictions.region, region)));
    } else if (sector) {
      query = query.where(eq(predictions.sector, sector));
    } else if (region) {
      query = query.where(eq(predictions.region, region));
    }
    
    return await query.orderBy(desc(predictions.createdAt));
  }

  async getPredictionById(id: number): Promise<Prediction | undefined> {
    const result = await db.select().from(predictions).where(eq(predictions.id, id));
    return result[0];
  }

  async createPrediction(insertPrediction: InsertPrediction): Promise<Prediction> {
    const result = await db.insert(predictions).values(insertPrediction).returning();
    return result[0];
  }

  async getRecentPredictions(sector: string, region: string, limit: number = 10): Promise<Prediction[]> {
    return await db.select().from(predictions)
      .where(and(eq(predictions.sector, sector), eq(predictions.region, region)))
      .orderBy(desc(predictions.createdAt))
      .limit(limit);
  }

  async getAlerts(userId?: number, sector?: string): Promise<Alert[]> {
    let query = db.select().from(alerts);
    
    if (userId && sector) {
      query = query.where(and(eq(alerts.userId, userId), eq(alerts.sector, sector)));
    } else if (userId) {
      query = query.where(eq(alerts.userId, userId));
    } else if (sector) {
      query = query.where(eq(alerts.sector, sector));
    }
    
    return await query.orderBy(desc(alerts.createdAt));
  }

  async getUnreadAlerts(userId: number, sector?: string): Promise<Alert[]> {
    let query = db.select().from(alerts)
      .where(and(eq(alerts.userId, userId), eq(alerts.isRead, false)));
    
    if (sector) {
      query = query.where(and(
        eq(alerts.userId, userId), 
        eq(alerts.isRead, false),
        eq(alerts.sector, sector)
      ));
    }
    
    return await query.orderBy(desc(alerts.createdAt));
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const result = await db.insert(alerts).values(insertAlert).returning();
    return result[0];
  }

  async markAlertAsRead(id: number): Promise<void> {
    await db.update(alerts).set({ isRead: true }).where(eq(alerts.id, id));
  }

  async getContextualData(sector: string, region: string, dataType?: string): Promise<ContextualData[]> {
    let query = db.select().from(contextualData)
      .where(and(eq(contextualData.sector, sector), eq(contextualData.region, region)));
    
    if (dataType) {
      query = query.where(and(
        eq(contextualData.sector, sector),
        eq(contextualData.region, region),
        eq(contextualData.dataType, dataType)
      ));
    }
    
    return await query.orderBy(desc(contextualData.recordedAt));
  }

  async createContextualData(insertData: InsertContextualData): Promise<ContextualData> {
    const result = await db.insert(contextualData).values(insertData).returning();
    return result[0];
  }

  async getReports(userId?: number, sector?: string): Promise<Report[]> {
    let query = db.select().from(reports);
    
    if (userId && sector) {
      query = query.where(and(eq(reports.userId, userId), eq(reports.sector, sector)));
    } else if (userId) {
      query = query.where(eq(reports.userId, userId));
    } else if (sector) {
      query = query.where(eq(reports.sector, sector));
    }
    
    return await query.orderBy(desc(reports.createdAt));
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const result = await db.insert(reports).values(insertReport).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();