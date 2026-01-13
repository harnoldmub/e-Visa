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
        visaType: "VOLANT_ORDINAIRE",
        status: "SUBMITTED",
        firstName: "Jean",
        lastName: "DUPONT",
        email: "jean.dupont@email.com",
        phone: "612345678",
        phoneCountryCode: "+33",
        nationality: "France",
        countryOfOrigin: "France",
        dateOfBirth: "1985-03-15",
        placeOfBirth: "Paris",
        gender: "male",
        civilStatus: "Marié(e)",
        occupation: "Ingénieur",
        address: "15 Rue de la Paix, Paris, France",
        passportNumber: "FR1234567",
        passportExpiryDate: "2030-01-15",
        arrivalDate: "2024-03-01",
        purposeOfVisit: "Voyage d'affaires pour réunion avec partenaires locaux",
        sponsorFirstName: "Patrick",
        sponsorLastName: "MUKENDI",
        sponsorNationality: "RDC",
        sponsorAddress: "Avenue de la Gombe, Kinshasa",
        sponsorPhone: "812345678",
        sponsorRelation: "Partenaire commercial",
        paymentStatus: "PAID",
      },
      {
        visaType: "VOLANT_SPECIFIQUE",
        status: "UNDER_REVIEW",
        firstName: "Marie",
        lastName: "MARTIN",
        email: "marie.martin@company.com",
        phone: "471234567",
        phoneCountryCode: "+32",
        nationality: "Belgique",
        countryOfOrigin: "Belgique",
        dateOfBirth: "1990-07-22",
        placeOfBirth: "Bruxelles",
        gender: "female",
        civilStatus: "Célibataire",
        occupation: "Directrice commerciale",
        address: "Avenue Louise 100, Bruxelles, Belgique",
        passportNumber: "BE9876543",
        passportExpiryDate: "2029-06-10",
        arrivalDate: "2024-04-10",
        purposeOfVisit: "Mission commerciale dans le secteur minier",
        sponsorFirstName: "Serge",
        sponsorLastName: "KABONGO",
        sponsorNationality: "RDC",
        sponsorAddress: "Avenue des Mines, Lubumbashi",
        sponsorPhone: "812345679",
        sponsorRelation: "Employeur",
        paymentStatus: "PAID",
      },
      {
        visaType: "VOLANT_ORDINAIRE",
        status: "ISSUED",
        firstName: "John",
        lastName: "SMITH",
        email: "john.smith@email.com",
        phone: "7123456789",
        phoneCountryCode: "+44",
        nationality: "Royaume-Uni",
        countryOfOrigin: "Royaume-Uni",
        dateOfBirth: "1978-11-30",
        placeOfBirth: "London",
        gender: "male",
        civilStatus: "Marié(e)",
        occupation: "Consultant",
        address: "10 Downing Street, London, UK",
        passportNumber: "UK5678901",
        passportExpiryDate: "2031-03-20",
        arrivalDate: "2024-05-01",
        purposeOfVisit: "Consultation technique",
        sponsorFirstName: "Alain",
        sponsorLastName: "TSHISEKEDI",
        sponsorNationality: "RDC",
        sponsorAddress: "Boulevard du 30 Juin, Kinshasa",
        sponsorPhone: "812345670",
        sponsorRelation: "Client",
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
    const user: User = { 
      id,
      username: insertUser.username,
      password: insertUser.password,
      role: insertUser.role || "agent",
      fullName: insertUser.fullName || null,
    };
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
      visaType: insertApp.visaType || "VOLANT_ORDINAIRE",
      status: insertApp.status || "SUBMITTED",
      codeInstitution: insertApp.codeInstitution || null,
      // Requérant info
      firstName: insertApp.firstName || "",
      lastName: insertApp.lastName || "",
      email: insertApp.email || "",
      phone: insertApp.phone || "",
      phoneCountryCode: insertApp.phoneCountryCode || "+243",
      nationality: insertApp.nationality || "",
      countryOfOrigin: insertApp.countryOfOrigin || "",
      dateOfBirth: insertApp.dateOfBirth || "",
      placeOfBirth: insertApp.placeOfBirth || "",
      gender: insertApp.gender || "",
      civilStatus: insertApp.civilStatus || "",
      occupation: insertApp.occupation || "",
      address: insertApp.address || "",
      // Passport
      passportNumber: insertApp.passportNumber || "",
      passportExpiryDate: insertApp.passportExpiryDate || "",
      // Travel
      arrivalDate: insertApp.arrivalDate || "",
      purposeOfVisit: insertApp.purposeOfVisit || "",
      // Documents
      photoId: insertApp.photoId || null,
      passportScan: insertApp.passportScan || null,
      // Sponsor info
      sponsorFirstName: insertApp.sponsorFirstName || null,
      sponsorLastName: insertApp.sponsorLastName || null,
      sponsorPlaceOfBirth: insertApp.sponsorPlaceOfBirth || null,
      sponsorDateOfBirth: insertApp.sponsorDateOfBirth || null,
      sponsorGender: insertApp.sponsorGender || null,
      sponsorIdNumber: insertApp.sponsorIdNumber || null,
      sponsorIdExpiry: insertApp.sponsorIdExpiry || null,
      sponsorIdIssuedBy: insertApp.sponsorIdIssuedBy || null,
      sponsorCivilStatus: insertApp.sponsorCivilStatus || null,
      sponsorAddress: insertApp.sponsorAddress || null,
      sponsorNationality: insertApp.sponsorNationality || null,
      sponsorEmail: insertApp.sponsorEmail || null,
      sponsorPhone: insertApp.sponsorPhone || null,
      sponsorPhoneCountryCode: insertApp.sponsorPhoneCountryCode || "+243",
      sponsorRelation: insertApp.sponsorRelation || null,
      // Sponsor documents
      sponsorRequestLetter: insertApp.sponsorRequestLetter || null,
      sponsorPassportScan: insertApp.sponsorPassportScan || null,
      sponsorVisaScan: insertApp.sponsorVisaScan || null,
      // Payment & Meta
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
      id,
      applicationId: insertPayment.applicationId,
      provider: insertPayment.provider || "MPESA",
      phoneNumber: insertPayment.phoneNumber,
      transactionId: insertPayment.transactionId || null,
      amount: insertPayment.amount,
      currency: insertPayment.currency || "USD",
      status: insertPayment.status || "INITIATED",
      paidAt: insertPayment.paidAt || null,
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
      id,
      actorId: insertLog.actorId || null,
      actorName: insertLog.actorName || null,
      action: insertLog.action,
      entityType: insertLog.entityType,
      entityId: insertLog.entityId || null,
      metadata: insertLog.metadata || null,
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
