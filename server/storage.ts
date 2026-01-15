import {
  type User,
  type InsertUser,
  type Application,
  type InsertApplication,
  type Visa,
  type InsertVisa,
  type Payment,
  type InsertPayment,
  type AuditLog,
  type InsertAuditLog,
  type VisaProduct,
  type InsertVisaProduct,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";
import {
  users, applications, visas, payments, auditLogs, visaProducts
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Visa Products
  getVisaProducts(): Promise<VisaProduct[]>;
  createVisaProduct(product: InsertVisaProduct): Promise<VisaProduct>;

  // Applications
  getApplications(): Promise<Application[]>;
  getApplication(id: string): Promise<Application | undefined>;
  getApplicationByNumber(applicationNumber: string): Promise<Application | undefined>;
  getNextApplicationSequence(): Promise<number>;
  createApplication(application: InsertApplication & { applicationNumber?: string; sequenceNumber?: number }): Promise<Application>;
  updateApplication(id: string, data: Partial<Application>): Promise<Application | undefined>;

  // Visas
  getVisa(id: string): Promise<Visa | undefined>;
  getVisaByVerificationCode(code: string): Promise<Visa | undefined>;
  getVisaByApplicationId(applicationId: string): Promise<Visa | undefined>;
  createVisa(visa: InsertVisa): Promise<Visa>;

  // Payments
  getPayment(id: string): Promise<Payment | undefined>;
  getPaymentByApplicationId(applicationId: string): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: string, data: Partial<Payment>): Promise<Payment | undefined>;

  // Audit Logs
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(entityType?: string, entityId?: string): Promise<AuditLog[]>;

  // Stats
  getStats(): Promise<{
    total: number;
    submitted: number;
    underReview: number;
    approved: number;
    rejected: number;
    issued: number;
  }>;
}

function generateVisaNumber(sequenceNumber: number): string {
  // Format: E-VVL/DGM/DG/CAB/0000001
  const paddedSequence = sequenceNumber.toString().padStart(7, '0');
  return `E-VVL/DGM/DG/CAB/${paddedSequence}`;
}

function generateVerificationCode(): string {
  return Math.random().toString(36).substring(2, 14).toUpperCase();
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Visa Products
  async getVisaProducts(): Promise<VisaProduct[]> {
    return db.select().from(visaProducts).where(eq(visaProducts.isActive, true));
  }

  async createVisaProduct(product: InsertVisaProduct): Promise<VisaProduct> {
    const result = await db.insert(visaProducts).values(product).returning();
    return result[0];
  }

  // Applications
  async getApplications(): Promise<Application[]> {
    return db.select().from(applications).orderBy(desc(applications.submittedAt));
  }

  async getApplication(id: string): Promise<Application | undefined> {
    const result = await db.select().from(applications).where(eq(applications.id, id));
    return result[0];
  }

  async getApplicationByNumber(applicationNumber: string): Promise<Application | undefined> {
    // Case-insensitive search using SQL lower()
    const result = await db.select().from(applications).where(sql`lower(${applications.applicationNumber}) = lower(${applicationNumber})`);
    return result[0];
  }

  async getNextApplicationSequence(): Promise<number> {
    // Use MAX(sequence_number) to ensure strict incremental order
    const result = await db.select({ maxSeq: sql<number>`MAX(${applications.sequenceNumber})` }).from(applications);
    return (result[0].maxSeq || 0) + 1;
  }

  async createApplication(insertApp: InsertApplication & { applicationNumber?: string; sequenceNumber?: number }): Promise<Application> {
    // If sequence didn't happen in the route (it should usually), we double check here or fail
    // Ideally the route handler handles the logic of generating the number and sequence
    // But if not provided, we can auto-generate (though risky for race conditions without transaction)

    let sequenceNumber = insertApp.sequenceNumber;
    let applicationNumber = insertApp.applicationNumber;

    if (!sequenceNumber) {
      sequenceNumber = await this.getNextApplicationSequence();
    }

    // Fallback if applicationNumber is missing (should be provided by strict format in route)
    if (!applicationNumber) {
      // This fallback is weak, better to ensure route provides it
      const year = new Date().getFullYear().toString().slice(-2);
      const seqStr = sequenceNumber.toString().padStart(6, '0');
      applicationNumber = `eVisa-XXX-${year}-${seqStr}`;
    }

    const result = await db.insert(applications).values({
      ...insertApp,
      sequenceNumber: sequenceNumber!,
      applicationNumber: applicationNumber!,
      submittedAt: insertApp.status === "SUBMITTED" ? new Date() : null,
    }).returning();
    return result[0];
  }

  async updateApplication(id: string, data: Partial<Application>): Promise<Application | undefined> {
    const result = await db
      .update(applications)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(applications.id, id))
      .returning();
    return result[0];
  }

  // Visas
  async getVisa(id: string): Promise<Visa | undefined> {
    const result = await db.select().from(visas).where(eq(visas.id, id));
    return result[0];
  }

  async getVisaByVerificationCode(code: string): Promise<Visa | undefined> {
    const result = await db.select().from(visas).where(eq(visas.verificationCode, code));
    return result[0];
  }

  async getVisaByApplicationId(applicationId: string): Promise<Visa | undefined> {
    const result = await db.select().from(visas).where(eq(visas.applicationId, applicationId));
    return result[0];
  }

  async createVisa(insertVisa: Partial<InsertVisa>): Promise<Visa> {
    const visaNumber = generateVisaNumber();
    const verificationCode = generateVerificationCode();

    // Ensure we have required fields
    if (!insertVisa.applicationId || !insertVisa.validFrom || !insertVisa.validTo || !insertVisa.stayDuration) {
      throw new Error("Missing required visa fields");
    }

    const result = await db.insert(visas).values({
      visaNumber,
      verificationCode,
      applicationId: insertVisa.applicationId,
      validFrom: insertVisa.validFrom,
      validTo: insertVisa.validTo,
      stayDuration: insertVisa.stayDuration,
      pdfUrl: insertVisa.pdfUrl,
      issuedAt: new Date(),
    }).returning();
    return result[0];
  }

  // Payments
  async getPayment(id: string): Promise<Payment | undefined> {
    const result = await db.select().from(payments).where(eq(payments.id, id));
    return result[0];
  }

  async getPaymentByApplicationId(applicationId: string): Promise<Payment | undefined> {
    const result = await db.select().from(payments).where(eq(payments.applicationId, applicationId));
    return result[0];
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const result = await db.insert(payments).values(insertPayment).returning();
    return result[0];
  }

  async updatePayment(id: string, data: Partial<Payment>): Promise<Payment | undefined> {
    const result = await db.update(payments).set(data).where(eq(payments.id, id)).returning();
    return result[0];
  }

  // Audit Logs
  async createAuditLog(insertLog: InsertAuditLog): Promise<AuditLog> {
    const result = await db.insert(auditLogs).values(insertLog).returning();
    return result[0];
  }

  async getAuditLogs(entityType?: string, entityId?: string): Promise<AuditLog[]> {
    let query = db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp));

    if (entityType && entityId) {
      // logic to filter would go here, simpler to filter in memory for small datasets 
      // or construct precise query
      // For now, returning all for admin simplicity or implementing specific where clauses
      const conditions = [];
      if (entityType) conditions.push(eq(auditLogs.entityType, entityType));
      if (entityId) conditions.push(eq(auditLogs.entityId, entityId));

      // Note: Dynamic where construction in drizzle is possible but for brevity:
      // If filtering needed, better to separate methods or use dynamic query builder
    }
    return query;
  }

  // Stats
  async getStats() {
    const allApps = await db.select().from(applications);
    return {
      total: allApps.length,
      submitted: allApps.filter((a) => a.status === "SUBMITTED").length,
      underReview: allApps.filter((a) => a.status === "UNDER_REVIEW").length,
      approved: allApps.filter((a) => a.status === "APPROVED").length,
      rejected: allApps.filter((a) => a.status === "REJECTED").length,
      issued: allApps.filter((a) => a.status === "ISSUED").length,
    };
  }
}

export const storage = new DatabaseStorage();
