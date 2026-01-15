import type { Request, Response } from "express";
import { storage } from "../storage";
import { getCountryISO3 } from "@shared/schema";
import { DraftSchema, UpdateApplicationSchema } from "../utils/schemas";
import * as emailService from "../services/email.service";
import { validateBeforeApproval } from "@shared/validation";

export async function getApplication(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const application = await storage.getApplication(id);

        if (!application) {
            return res.status(404).json({ error: "Demande introuvable" });
        }

        res.json(application);
    } catch (error) {
        console.error("Error fetching application:", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
}

export async function createDraftApplication(req: Request, res: Response) {
    try {
        const body = DraftSchema.parse(req.body);

        // Generate Reference Number and Sequence strictly
        const iso3 = getCountryISO3(body.nationality);
        const year = new Date().getFullYear().toString().slice(-2);

        // Strict incremental sequence
        const sequence = await storage.getNextApplicationSequence();
        const sequenceStr = sequence.toString().padStart(5, '0');
        const applicationNumber = `eVisa-${iso3}-${year}-${sequenceStr}`;

        // Create Draft Application
        const application = await storage.createApplication({
            visaType: body.visaType || "VOLANT_ORDINAIRE",
            status: "DRAFT",
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            nationality: body.nationality,
            applicationNumber,
            sequenceNumber: sequence,
        });

        // Send Email via email service
        await emailService.sendDraftConfirmationEmail(application);


        // Create audit log
        await storage.createAuditLog({
            action: "APPLICATION_DRAFT_CREATED",
            entityType: "application",
            entityId: application.id,
            actorId: null,
            actorName: `${body.firstName} ${body.lastName}`,
            metadata: { applicationNumber, sequence },
        });

        res.status(201).json(application);
    } catch (error) {
        console.error("Error creating draft application:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function updateApplication(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const body = req.body;

        const existingApp = await storage.getApplication(id);
        if (!existingApp) {
            return res.status(404).json({ error: "Application not found" });
        }

        const updatedApp = await storage.updateApplication(id, body);

        if (body.status === "SUBMITTED" && existingApp.status === "DRAFT") {
            // Fetch Product Info from DB for Pricing
            const products = await storage.getVisaProducts();
            const product = products.find(p => p.type === updatedApp?.visaType);
            const amount = product ? product.price + 5 : 255;

            // Check if payment exists
            const existingPayment = await storage.getPaymentByApplicationId(id);
            if (!existingPayment && updatedApp) {
                await storage.createPayment({
                    applicationId: updatedApp.id,
                    provider: "MPESA",
                    phoneNumber: updatedApp.phone || "",
                    amount,
                    currency: "USD",
                    status: "PENDING",
                    transactionId: null,
                    paidAt: null,
                });

                // Simulate payment success
                setTimeout(async () => {
                    if (updatedApp) {
                        const payment = await storage.getPaymentByApplicationId(updatedApp.id);
                        if (payment) {
                            await storage.updatePayment(payment.id, {
                                status: "PAID",
                                transactionId: `TXN-${Date.now()}`,
                                paidAt: new Date(),
                            });
                            await storage.updateApplication(updatedApp.id, {
                                paymentStatus: "PAID",
                            });
                        }
                    }
                }, 2000);
            }

            // Log submission
            await storage.createAuditLog({
                action: "APPLICATION_SUBMITTED",
                entityType: "application",
                entityId: id,
                actorId: null,
                actorName: `${updatedApp?.firstName} ${updatedApp?.lastName}`,
                metadata: { applicationNumber: existingApp.applicationNumber },
            });
        }

        res.json(updatedApp);
    } catch (error) {
        console.error("Error updating application:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function trackApplication(req: Request, res: Response) {
    try {
        const { ref } = req.params;
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ error: "Email address is required" });
        }

        const application = await storage.getApplicationByNumber(ref);

        if (!application) {
            return res.status(404).json({ error: "Application not found" });
        }

        // Verify email matches (case-insensitive)
        if (application.email.toLowerCase() !== (email as string).toLowerCase()) {
            return res.status(404).json({ error: "Application not found" });
        }

        res.json(application);
    } catch (error) {
        console.error("Error tracking application:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function getVisaProducts(req: Request, res: Response) {
    try {
        const products = await storage.getVisaProducts();
        res.json(products);
    } catch (error) {
        console.error("Error fetching visa products:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
