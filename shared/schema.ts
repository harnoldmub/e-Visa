import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Visa Types
export const visaTypes = ["TOURISM", "BUSINESS", "TRANSIT", "SHORT_STAY"] as const;
export type VisaType = typeof visaTypes[number];

// Application Status
export const applicationStatuses = [
  "DRAFT",
  "SUBMITTED",
  "UNDER_REVIEW",
  "NEED_INFO",
  "APPROVED",
  "REJECTED",
  "ISSUED",
  "EXPIRED",
  "REVOKED"
] as const;
export type ApplicationStatus = typeof applicationStatuses[number];

// Payment Status
export const paymentStatuses = ["INITIATED", "PENDING", "PAID", "FAILED", "CANCELLED"] as const;
export type PaymentStatus = typeof paymentStatuses[number];

// Users table (admin users)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("agent"),
  fullName: text("full_name"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
  fullName: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Visa Applications table
export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationNumber: text("application_number").notNull().unique(),
  visaType: text("visa_type").notNull(),
  status: text("status").notNull().default("DRAFT"),
  
  // Personal Information
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  nationality: text("nationality").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  placeOfBirth: text("place_of_birth").notNull(),
  gender: text("gender").notNull(),
  occupation: text("occupation"),
  
  // Passport Information
  passportNumber: text("passport_number").notNull(),
  passportIssueDate: text("passport_issue_date").notNull(),
  passportExpiryDate: text("passport_expiry_date").notNull(),
  passportIssuingCountry: text("passport_issuing_country").notNull(),
  
  // Travel Information
  arrivalDate: text("arrival_date").notNull(),
  departureDate: text("departure_date").notNull(),
  entryPoint: text("entry_point").notNull(),
  addressInDRC: text("address_in_drc").notNull(),
  purposeOfVisit: text("purpose_of_visit"),
  
  // Sponsor/Host Information
  sponsorName: text("sponsor_name"),
  sponsorAddress: text("sponsor_address"),
  sponsorPhone: text("sponsor_phone"),
  
  // Documents (URLs/paths)
  passportScan: text("passport_scan"),
  photoId: text("photo_id"),
  invitationLetter: text("invitation_letter"),
  
  // Payment
  paymentStatus: text("payment_status").default("INITIATED"),
  
  // Timestamps
  submittedAt: timestamp("submitted_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  
  // Admin notes
  adminNotes: text("admin_notes"),
  rejectionReason: text("rejection_reason"),
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  applicationNumber: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;

// Visas table (issued e-Visas)
export const visas = pgTable("visas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  visaNumber: text("visa_number").notNull().unique(),
  verificationCode: text("verification_code").notNull().unique(),
  applicationId: varchar("application_id").notNull(),
  
  // Visa details
  validFrom: text("valid_from").notNull(),
  validTo: text("valid_to").notNull(),
  stayDuration: integer("stay_duration").notNull(), // in days
  
  // PDF
  pdfUrl: text("pdf_url"),
  
  // Timestamps
  issuedAt: timestamp("issued_at").defaultNow(),
});

export const insertVisaSchema = createInsertSchema(visas).omit({
  id: true,
  issuedAt: true,
});

export type InsertVisa = z.infer<typeof insertVisaSchema>;
export type Visa = typeof visas.$inferSelect;

// Payments table
export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull(),
  provider: text("provider").notNull().default("MPESA"),
  phoneNumber: text("phone_number").notNull(),
  transactionId: text("transaction_id"),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("USD"),
  status: text("status").notNull().default("INITIATED"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

// Audit Logs table
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  actorId: varchar("actor_id"),
  actorName: text("actor_name"),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: varchar("entity_id"),
  metadata: jsonb("metadata"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  timestamp: true,
});

export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;

// Form validation schemas
export const personalInfoSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  nationality: z.string().min(2, "Nationalité requise"),
  dateOfBirth: z.string().min(1, "Date de naissance requise"),
  placeOfBirth: z.string().min(2, "Lieu de naissance requis"),
  gender: z.enum(["male", "female", "other"]),
  occupation: z.string().optional(),
});

export const passportInfoSchema = z.object({
  passportNumber: z.string().min(5, "Numéro de passeport invalide"),
  passportIssueDate: z.string().min(1, "Date d'émission requise"),
  passportExpiryDate: z.string().min(1, "Date d'expiration requise"),
  passportIssuingCountry: z.string().min(2, "Pays d'émission requis"),
});

export const travelInfoSchema = z.object({
  arrivalDate: z.string().min(1, "Date d'arrivée requise"),
  departureDate: z.string().min(1, "Date de départ requise"),
  entryPoint: z.string().min(2, "Point d'entrée requis"),
  addressInDRC: z.string().min(5, "Adresse en RDC requise"),
  purposeOfVisit: z.string().optional(),
  sponsorName: z.string().optional(),
  sponsorAddress: z.string().optional(),
  sponsorPhone: z.string().optional(),
});

// Visa type labels
export const visaTypeLabels: Record<VisaType, { fr: string; en: string; duration: number; price: number }> = {
  TOURISM: { fr: "Tourisme", en: "Tourism", duration: 30, price: 50 },
  BUSINESS: { fr: "Affaires", en: "Business", duration: 90, price: 100 },
  TRANSIT: { fr: "Transit", en: "Transit", duration: 7, price: 30 },
  SHORT_STAY: { fr: "Court séjour", en: "Short Stay", duration: 15, price: 40 },
};

// Status labels with colors
export const statusLabels: Record<ApplicationStatus, { fr: string; en: string; color: string }> = {
  DRAFT: { fr: "Brouillon", en: "Draft", color: "gray" },
  SUBMITTED: { fr: "Soumis", en: "Submitted", color: "blue" },
  UNDER_REVIEW: { fr: "En cours d'examen", en: "Under Review", color: "yellow" },
  NEED_INFO: { fr: "Informations requises", en: "Need Info", color: "orange" },
  APPROVED: { fr: "Approuvé", en: "Approved", color: "green" },
  REJECTED: { fr: "Rejeté", en: "Rejected", color: "red" },
  ISSUED: { fr: "Émis", en: "Issued", color: "green" },
  EXPIRED: { fr: "Expiré", en: "Expired", color: "gray" },
  REVOKED: { fr: "Révoqué", en: "Revoked", color: "red" },
};

// Entry points in DRC
export const entryPoints = [
  "Aéroport International de N'djili (Kinshasa)",
  "Aéroport de Lubumbashi",
  "Aéroport de Goma",
  "Aéroport de Kisangani",
  "Poste frontalier de Kasumbalesa",
  "Poste frontalier de Lufu",
  "Port de Matadi",
  "Autre",
] as const;

// Countries list (subset)
export const countries = [
  "Afghanistan", "Albanie", "Algérie", "Allemagne", "Angola", "Argentine",
  "Australie", "Autriche", "Belgique", "Bénin", "Brésil", "Burkina Faso",
  "Burundi", "Cameroun", "Canada", "Centrafrique", "Chine", "Congo-Brazzaville",
  "Côte d'Ivoire", "Égypte", "Espagne", "États-Unis", "Éthiopie", "France",
  "Gabon", "Ghana", "Guinée", "Inde", "Italie", "Japon", "Kenya", "Libéria",
  "Madagascar", "Mali", "Maroc", "Mozambique", "Niger", "Nigeria", "Ouganda",
  "Pakistan", "Pays-Bas", "Portugal", "République Sud-Africaine", "Royaume-Uni",
  "Rwanda", "Sénégal", "Soudan", "Suisse", "Tanzanie", "Tchad", "Togo",
  "Tunisie", "Turquie", "Zambie", "Zimbabwe", "Autre",
] as const;
