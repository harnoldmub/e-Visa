import { z } from "zod";

export const DraftSchema = z.object({
    firstName: z.string().min(1, "Le prénom est obligatoire"),
    lastName: z.string().min(1, "Le nom est obligatoire"),
    email: z.string().email("Adresse email invalide"),
    nationality: z.string().min(2, "La nationalité est obligatoire"),
    visaType: z.string().optional(),
});

export const AdminStatusSchema = z.object({
    status: z.enum(["UNDER_REVIEW", "NEED_INFO", "REJECTED", "APPROVED", "ISSUED"]),
    notes: z.string().optional().nullable(),
});

// Update application schema (for PATCH /api/applications/:id)
export const UpdateApplicationSchema = z.object({
    // Personal info
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    email: z.string().email().optional(),
    dateOfBirth: z.coerce.date().optional(),
    placeOfBirth: z.string().min(2).optional(),
    gender: z.enum(["M", "F"]).optional(),
    nationality: z.string().min(2).optional(),

    // Passport info
    passportNumber: z
        .string()
        .min(6)
        .max(15)
        .regex(/^[A-Z0-9]+$/i)
        .optional(),
    passportExpiry: z.coerce.date().optional(),
    passportCopyPath: z.string().optional(),

    // Travel info
    countryOfOrigin: z.string().min(2).optional(),
    arrivalDate: z.coerce.date().optional(),
    purposeOfVisit: z.string().min(10).max(500).optional(),
    institutionCode: z.string().max(50).optional(),

    // Contact
    phone: z.string().min(8).optional(),
    address: z.string().optional(),

    // Sponsor info
    sponsorFirstName: z.string().optional(),
    sponsorLastName: z.string().optional(),
    sponsorAddress: z.string().optional(),

    // Files
    photoPath: z.string().optional(),

    // Status
    status: z.enum(["DRAFT", "SUBMITTED", "UNDER_REVIEW", "NEED_INFO", "REJECTED", "APPROVED", "ISSUED"]).optional(),
    paymentStatus: z.enum(["PENDING", "PAID", "FAILED"]).optional(),
});
