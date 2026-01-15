import { z } from "zod";

// Helper functions for date validation
const addMonths = (date: Date, months: number): Date => {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
};

const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

const getAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

// Application validation schema
export const applicationValidationSchema = z.object({
    // Code institution (optionnel)
    institutionCode: z
        .string()
        .max(50, "Le code institution ne peut pas dépasser 50 caractères")
        .regex(/^[A-Z0-9-]*$/i, "Le code institution ne peut contenir que des lettres, chiffres et tirets")
        .optional()
        .or(z.literal("")),

    // Date d'entrée (obligatoire, future, max 90 jours)
    arrivalDate: z.coerce
        .date({
            required_error: "La date d'entrée est obligatoire",
            invalid_type_error: "Date d'entrée invalide",
        })
        .refine((date) => date >= addDays(new Date(), 1), {
            message: "La date d'entrée doit être au moins demain",
        })
        .refine((date) => date <= addDays(new Date(), 90), {
            message: "La date d'entrée ne peut pas dépasser 90 jours à partir d'aujourd'hui",
        }),

    // N° passeport (obligatoire, 6-15 caractères, alphanumériques)
    passportNumber: z
        .string({
            required_error: "Le numéro de passeport est obligatoire",
        })
        .min(6, "Le numéro de passeport doit contenir au moins 6 caractères")
        .max(15, "Le numéro de passeport ne peut pas dépasser 15 caractères")
        .regex(/^[A-Z0-9]+$/i, "Le numéro de passeport ne peut contenir que des lettres et chiffres (sans espaces)"),

    // Validité du passeport (obligatoire)
    passportExpiry: z.coerce.date({
        required_error: "La date d'expiration du passeport est obligatoire",
        invalid_type_error: "Date d'expiration invalide",
    }),

    // Date de naissance (obligatoire, >= 18 ans)
    dateOfBirth: z.coerce
        .date({
            required_error: "La date de naissance est obligatoire",
            invalid_type_error: "Date de naissance invalide",
        })
        .refine((date) => date < new Date(), {
            message: "La date de naissance doit être dans le passé",
        })
        .refine((date) => getAge(date) >= 18, {
            message: "Vous devez avoir au moins 18 ans pour faire une demande",
        }),

    // Lieu de naissance (obligatoire, min 2 caractères)
    placeOfBirth: z
        .string({
            required_error: "Le lieu de naissance est obligatoire",
        })
        .min(2, "Le lieu de naissance doit contenir au moins 2 caractères"),

    // Pays de provenance (obligatoire)
    countryOfOrigin: z
        .string({
            required_error: "Le pays de provenance est obligatoire",
        })
        .min(2, "Veuillez sélectionner un pays valide"),

    // Téléphone (obligatoire, min 8 caractères)
    phone: z
        .string({
            required_error: "Le numéro de téléphone est obligatoire",
        })
        .min(8, "Le numéro de téléphone doit contenir au moins 8 chiffres")
        .regex(/^\+?[0-9\s-()]+$/, "Format de téléphone invalide"),

    // Genre (obligatoire)
    gender: z.enum(["M", "F"], {
        required_error: "Le genre est obligatoire",
        invalid_type_error: "Veuillez sélectionner M (Masculin) ou F (Féminin)",
    }),

    // Raison du voyage (obligatoire, 10-500 caractères)
    purposeOfVisit: z
        .string({
            required_error: "La raison du voyage est obligatoire",
        })
        .min(10, "La raison du voyage doit contenir au moins 10 caractères")
        .max(500, "La raison du voyage ne peut pas dépasser 500 caractères"),
});

// Refined schema with cross-field validation
export const applicationSchemaWithCrossValidation = applicationValidationSchema.refine(
    (data) => {
        // Passport must be valid for at least 6 months after entry date
        const sixMonthsAfterEntry = addMonths(data.arrivalDate, 6);
        return data.passportExpiry > sixMonthsAfterEntry;
    },
    {
        message: "La validité du passeport doit dépasser de 6 mois la date d'entrée prévue",
        path: ["passportExpiry"],
    }
);

// File validation schemas
export const photoFileSchema = z.object({
    size: z.number().max(2 * 1024 * 1024, "La photo ne doit pas dépasser 2MB"),
    type: z.enum(["image/jpeg", "image/jpg", "image/png"], {
        errorMap: () => ({ message: "La photo doit être au format JPG ou PNG" }),
    }),
});

export const passportFileSchema = z.object({
    size: z.number().max(5 * 1024 * 1024, "La copie du passeport ne doit pas dépasser 5MB"),
    type: z.enum(["image/jpeg", "image/jpg", "image/png", "application/pdf"], {
        errorMap: () => ({ message: "La copie du passeport doit être au format JPG, PNG ou PDF" }),
    }),
});

// Submission validation (before SUBMITTED status)
export const submissionValidationSchema = applicationSchemaWithCrossValidation.extend({
    photoPath: z.string({
        required_error: "La photo du demandeur est obligatoire",
    }),
    passportCopyPath: z.string({
        required_error: "La copie du passeport est obligatoire",
    }),
    paymentStatus: z.enum(["PAID"], {
        errorMap: () => ({ message: "Le paiement doit être confirmé avant la soumission" }),
    }),
});

// Helper to validate before approval
export function validateBeforeApproval(application: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Photo required
    if (!application.photoPath) {
        errors.push("Photo du demandeur manquante");
    }

    // Passport copy required
    if (!application.passportCopyPath) {
        errors.push("Copie du passeport manquante");
    }

    // Payment must be confirmed
    if (application.paymentStatus !== "PAID") {
        errors.push("Le paiement n'a pas été confirmé");
    }

    // Passport must be valid for at least 6 months after entry
    if (application.passportExpiry && application.arrivalDate) {
        const sixMonthsAfterEntry = addMonths(new Date(application.arrivalDate), 6);
        if (new Date(application.passportExpiry) <= sixMonthsAfterEntry) {
            errors.push("La validité du passeport doit dépasser de 6 mois la date d'entrée");
        }
    }

    // Entry date must be in the future
    if (application.arrivalDate && new Date(application.arrivalDate) < new Date()) {
        errors.push("La date d'entrée est déjà passée");
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

// Helper to get user-friendly error messages
export function formatValidationErrors(zodError: z.ZodError): Record<string, string> {
    const formatted: Record<string, string> = {};

    zodError.errors.forEach((error) => {
        const path = error.path.join(".");
        formatted[path] = error.message;
    });

    return formatted;
}
