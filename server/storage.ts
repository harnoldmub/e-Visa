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
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Applications
  getApplications(): Promise<Application[]>;
  getApplication(id: string): Promise<Application | undefined>;
  getApplicationByNumber(applicationNumber: string): Promise<Application | undefined>;
  createApplication(application: InsertApplication): Promise<Application>;
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

function generateApplicationNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `DRC-${year}-${random}`;
}

function generateVisaNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `VISA-${year}-${random}`;
}

function generateVerificationCode(): string {
  return Math.random().toString(36).substring(2, 14).toUpperCase();
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private applications: Map<string, Application>;
  private visas: Map<string, Visa>;
  private payments: Map<string, Payment>;
  private auditLogs: Map<string, AuditLog>;

  constructor() {
    this.users = new Map();
    this.applications = new Map();
    this.visas = new Map();
    this.payments = new Map();
    this.auditLogs = new Map();
    
    // Create default admin user
    const adminId = randomUUID();
    this.users.set(adminId, {
      id: adminId,
      username: "admin",
      password: "admin123", // In production, this would be hashed
      role: "admin",
      fullName: "Administrateur DGM",
    });

    // Create sample applications for demo
    this.seedSampleData();
  }

  private seedSampleData() {
    const sampleApps: Partial<Application>[] = [
      {
        visaType: "TOURISM",
        status: "SUBMITTED",
        firstName: "Jean",
        lastName: "DUPONT",
        email: "jean.dupont@email.com",
        phone: "+33612345678",
        nationality: "France",
        dateOfBirth: "1985-03-15",
        placeOfBirth: "Paris, France",
        gender: "male",
        occupation: "Ingénieur",
        passportNumber: "FR1234567",
        passportIssueDate: "2020-01-15",
        passportExpiryDate: "2030-01-15",
        passportIssuingCountry: "France",
        arrivalDate: "2024-03-01",
        departureDate: "2024-03-15",
        entryPoint: "Aéroport International de N'djili (Kinshasa)",
        addressInDRC: "Hôtel Pullman, Kinshasa",
        paymentStatus: "PAID",
      },
      {
        visaType: "BUSINESS",
        status: "UNDER_REVIEW",
        firstName: "Marie",
        lastName: "MARTIN",
        email: "marie.martin@company.com",
        phone: "+32471234567",
        nationality: "Belgique",
        dateOfBirth: "1990-07-22",
        placeOfBirth: "Bruxelles, Belgique",
        gender: "female",
        occupation: "Directrice commerciale",
        passportNumber: "BE9876543",
        passportIssueDate: "2019-06-10",
        passportExpiryDate: "2029-06-10",
        passportIssuingCountry: "Belgique",
        arrivalDate: "2024-04-10",
        departureDate: "2024-04-25",
        entryPoint: "Aéroport de Lubumbashi",
        addressInDRC: "Radisson Blu, Lubumbashi",
        sponsorName: "Congo Mining Corp",
        sponsorAddress: "Avenue des Mines, Lubumbashi",
        sponsorPhone: "+243812345678",
        paymentStatus: "PAID",
      },
      {
        visaType: "TRANSIT",
        status: "APPROVED",
        firstName: "John",
        lastName: "SMITH",
        email: "john.smith@email.com",
        phone: "+447123456789",
        nationality: "Royaume-Uni",
        dateOfBirth: "1978-11-30",
        placeOfBirth: "London, UK",
        gender: "male",
        occupation: "Consultant",
        passportNumber: "UK5678901",
        passportIssueDate: "2021-03-20",
        passportExpiryDate: "2031-03-20",
        passportIssuingCountry: "Royaume-Uni",
        arrivalDate: "2024-05-01",
        departureDate: "2024-05-03",
        entryPoint: "Aéroport International de N'djili (Kinshasa)",
        addressInDRC: "Transit - Aéroport N'djili",
        paymentStatus: "PAID",
      },
    ];

    sampleApps.forEach((appData) => {
      const id = randomUUID();
      const app: Application = {
        id,
        applicationNumber: generateApplicationNumber(),
        ...appData,
        submittedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Application;
      this.applications.set(id, app);
    });
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Applications
  async getApplications(): Promise<Application[]> {
    return Array.from(this.applications.values()).sort((a, b) => {
      const dateA = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
      const dateB = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  async getApplication(id: string): Promise<Application | undefined> {
    return this.applications.get(id);
  }

  async getApplicationByNumber(applicationNumber: string): Promise<Application | undefined> {
    return Array.from(this.applications.values()).find(
      (app) => app.applicationNumber === applicationNumber,
    );
  }

  async createApplication(insertApp: Partial<InsertApplication>): Promise<Application> {
    const id = randomUUID();
    const applicationNumber = generateApplicationNumber();
    const app: Application = {
      id,
      applicationNumber,
      visaType: insertApp.visaType || "TOURISM",
      status: insertApp.status || "SUBMITTED",
      firstName: insertApp.firstName || "",
      lastName: insertApp.lastName || "",
      email: insertApp.email || "",
      phone: insertApp.phone || "",
      nationality: insertApp.nationality || "",
      dateOfBirth: insertApp.dateOfBirth || "",
      placeOfBirth: insertApp.placeOfBirth || "",
      gender: insertApp.gender || "",
      occupation: insertApp.occupation || null,
      passportNumber: insertApp.passportNumber || "",
      passportIssueDate: insertApp.passportIssueDate || "",
      passportExpiryDate: insertApp.passportExpiryDate || "",
      passportIssuingCountry: insertApp.passportIssuingCountry || "",
      arrivalDate: insertApp.arrivalDate || "",
      departureDate: insertApp.departureDate || "",
      entryPoint: insertApp.entryPoint || "",
      addressInDRC: insertApp.addressInDRC || "",
      purposeOfVisit: insertApp.purposeOfVisit || null,
      sponsorName: insertApp.sponsorName || null,
      sponsorAddress: insertApp.sponsorAddress || null,
      sponsorPhone: insertApp.sponsorPhone || null,
      passportScan: insertApp.passportScan || null,
      photoId: insertApp.photoId || null,
      invitationLetter: insertApp.invitationLetter || null,
      paymentStatus: insertApp.paymentStatus || "INITIATED",
      adminNotes: insertApp.adminNotes || null,
      rejectionReason: insertApp.rejectionReason || null,
      submittedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.applications.set(id, app);
    return app;
  }

  async updateApplication(id: string, data: Partial<Application>): Promise<Application | undefined> {
    const app = this.applications.get(id);
    if (!app) return undefined;
    
    const updatedApp = { ...app, ...data, updatedAt: new Date() };
    this.applications.set(id, updatedApp);
    return updatedApp;
  }

  // Visas
  async getVisa(id: string): Promise<Visa | undefined> {
    return this.visas.get(id);
  }

  async getVisaByVerificationCode(code: string): Promise<Visa | undefined> {
    return Array.from(this.visas.values()).find(
      (visa) => visa.verificationCode === code,
    );
  }

  async getVisaByApplicationId(applicationId: string): Promise<Visa | undefined> {
    return Array.from(this.visas.values()).find(
      (visa) => visa.applicationId === applicationId,
    );
  }

  async createVisa(insertVisa: Partial<InsertVisa>): Promise<Visa> {
    const id = randomUUID();
    const visaNumber = generateVisaNumber();
    const verificationCode = generateVerificationCode();
    
    const visa: Visa = {
      id,
      visaNumber,
      verificationCode,
      applicationId: insertVisa.applicationId || "",
      validFrom: insertVisa.validFrom || new Date().toISOString().split('T')[0],
      validTo: insertVisa.validTo || new Date().toISOString().split('T')[0],
      stayDuration: insertVisa.stayDuration || 30,
      pdfUrl: insertVisa.pdfUrl || null,
      issuedAt: new Date(),
    };
    this.visas.set(id, visa);
    return visa;
  }

  // Payments
  async getPayment(id: string): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  async getPaymentByApplicationId(applicationId: string): Promise<Payment | undefined> {
    return Array.from(this.payments.values()).find(
      (payment) => payment.applicationId === applicationId,
    );
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = randomUUID();
    const payment: Payment = {
      ...insertPayment,
      id,
      createdAt: new Date(),
    };
    this.payments.set(id, payment);
    return payment;
  }

  async updatePayment(id: string, data: Partial<Payment>): Promise<Payment | undefined> {
    const payment = this.payments.get(id);
    if (!payment) return undefined;
    
    const updatedPayment = { ...payment, ...data };
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }

  // Audit Logs
  async createAuditLog(insertLog: InsertAuditLog): Promise<AuditLog> {
    const id = randomUUID();
    const log: AuditLog = {
      ...insertLog,
      id,
      timestamp: new Date(),
    };
    this.auditLogs.set(id, log);
    return log;
  }

  async getAuditLogs(entityType?: string, entityId?: string): Promise<AuditLog[]> {
    let logs = Array.from(this.auditLogs.values());
    
    if (entityType) {
      logs = logs.filter((log) => log.entityType === entityType);
    }
    if (entityId) {
      logs = logs.filter((log) => log.entityId === entityId);
    }
    
    return logs.sort((a, b) => {
      const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return dateB - dateA;
    });
  }

  // Stats
  async getStats() {
    const apps = Array.from(this.applications.values());
    return {
      total: apps.length,
      submitted: apps.filter((a) => a.status === "SUBMITTED").length,
      underReview: apps.filter((a) => a.status === "UNDER_REVIEW").length,
      approved: apps.filter((a) => a.status === "APPROVED").length,
      rejected: apps.filter((a) => a.status === "REJECTED").length,
      issued: apps.filter((a) => a.status === "ISSUED").length,
    };
  }
}

export const storage = new MemStorage();
