import "./env";
import { db } from "./db";
import { users, applications, visas, payments, auditLogs, visaProducts } from "@shared/schema";

async function seed() {
    console.log("🌱 Starting database seed...");

    try {
        // 1. Clear existing data (in reverse order of dependencies)
        console.log("Cleaning up old data...");
        await db.delete(auditLogs);
        await db.delete(payments);
        await db.delete(visas);
        await db.delete(applications);
        await db.delete(users);
        await db.delete(visaProducts);

        // 2. Seed Visa Products
        console.log("Seeding Visa Products...");
        await db.insert(visaProducts).values([
            {
                type: "VOLANT_ORDINAIRE",
                labelFr: "Visa Volant Ordinaire",
                labelEn: "Standard Flying Visa",
                price: 250,
                currency: "USD",
                durationDays: 7,
                validityMonths: 3,
                isActive: true,
            },
            {
                type: "VOLANT_SPECIFIQUE",
                labelFr: "Visa Volant Spécifique",
                labelEn: "Specific Flying Visa",
                price: 800,
                currency: "USD",
                durationDays: 30,
                validityMonths: 3,
                isActive: true,
            }
        ]);

        // 3. Seed Admin User
        console.log("Seeding Admin User...");
        await db.insert(users).values({
            username: "admin",
            password: "admin123", // In a real app this should be hashed
            role: "SUPERADMIN",
            fullName: "Administrateur Système",
        });

        // 4. Seed Applications (Strict Validation Compliance)
        console.log("Seeding Sample Applications...");

        // Sample 1: Approved & Issued Application (Visa Volant Ordinaire)
        const app1Seq = 1;
        const app1Ref = "eVisa-FRA-26-00001";

        // Insert App 1
        const [app1] = await db.insert(applications).values({
            applicationNumber: app1Ref,
            sequenceNumber: app1Seq,
            visaType: "VOLANT_ORDINAIRE",
            status: "ISSUED",
            firstName: "Jean",
            lastName: "Dupont",
            email: "jean.dupont@example.com",
            phone: "+33612345678",
            phoneCountryCode: "+33",
            nationality: "France", // ISO3: FRA
            countryOfOrigin: "France",
            dateOfBirth: "1985-05-15",
            placeOfBirth: "Paris",
            gender: "male",
            civilStatus: "Marié(e)",
            occupation: "Ingénieur",
            address: "123 Rue de Rivoli, 75001 Paris, France",
            passportNumber: "AA1234567", // > 5 chars
            passportExpiryDate: "2030-01-01",
            arrivalDate: "2026-06-01",
            purposeOfVisit: "Tourisme",
            submittedAt: new Date("2026-05-20"),
            paymentStatus: "PAID",
        }).returning();

        // Insert Visa for App 1
        await db.insert(visas).values({
            visaNumber: "VISA-2026-A1B2C3",
            verificationCode: "CODE-XYZ123",
            applicationId: app1.id,
            validFrom: "2026-06-01",
            validTo: "2026-06-08", // 7 days
            stayDuration: 7,
            pdfUrl: `/api/visas/${app1.id}/pdf`,
            issuedAt: new Date("2026-05-25"),
        });

        // Sample 2: Under Review Application (Visa Volant Spécifique)
        const app2Seq = 2;
        const app2Ref = "eVisa-USA-26-00002";

        await db.insert(applications).values({
            applicationNumber: app2Ref,
            sequenceNumber: app2Seq,
            visaType: "VOLANT_SPECIFIQUE",
            status: "UNDER_REVIEW",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            phone: "+15551234567",
            phoneCountryCode: "+1",
            nationality: "États-Unis", // ISO3: USA
            countryOfOrigin: "USA",
            dateOfBirth: "1990-10-20",
            placeOfBirth: "New York",
            gender: "male",
            civilStatus: "Célibataire",
            occupation: "Consultant",
            address: "456 5th Ave, New York, NY 10018",
            passportNumber: "US987654321", // > 5 chars
            passportExpiryDate: "2029-12-31",
            arrivalDate: "2026-07-15",
            purposeOfVisit: "Affaires",
            submittedAt: new Date("2026-05-28"),
            paymentStatus: "PAID",
        });

        // Sample 3: Draft Application (Incomplete)
        const app3Seq = 3;
        const app3Ref = "eVisa-BEL-26-00003";

        await db.insert(applications).values({
            applicationNumber: app3Ref,
            sequenceNumber: app3Seq,
            visaType: "VOLANT_ORDINAIRE",
            status: "DRAFT",
            firstName: "Marie",
            lastName: "Peeters",
            email: "marie.peeters@example.be",
            nationality: "Belgique", // ISO3: BEL
            // Other fields optional in draft
        });

        console.log("✅ Seeding completed! Database is reset and populated with valid sample data.");
    } catch (error) {
        console.error("❌ Seeding failed:", error);
    } finally {
        process.exit(0);
    }
}

seed();
