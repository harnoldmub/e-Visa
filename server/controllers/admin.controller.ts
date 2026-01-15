import type { Request, Response } from "express";
import { storage } from "../storage";
import { AdminStatusSchema } from "../utils/schemas";
import { generateVisaNumber, generateVerificationCode } from "../utils/helpers";
import * as emailService from "../services/email.service";

export async function adminLogin(req: Request, res: Response) {
    try {
        const { username, password } = req.body;

        const user = await storage.getUserByUsername(username);

        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                fullName: user.fullName
            }
        });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function getDashboardStats(req: Request, res: Response) {
    try {
        const stats = await storage.getStats();
        res.json(stats);
    } catch (error) {
        console.error("Error getting stats:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function getAllApplications(req: Request, res: Response) {
    try {
        const applications = await storage.getApplications();
        res.json(applications);
    } catch (error) {
        console.error("Error getting applications:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function getApplicationById(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const application = await storage.getApplication(id);

        if (!application) {
            return res.status(404).json({ error: "Application not found" });
        }

        res.json(application);
    } catch (error) {
        console.error("Error getting application:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function updateApplicationStatus(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { status, notes } = AdminStatusSchema.parse(req.body);

        const application = await storage.getApplication(id);

        if (!application) {
            return res.status(404).json({ error: "Application not found" });
        }

        const updateData: any = { status };

        if (status === "REJECTED") {
            updateData.rejectionReason = notes;
        } else if (status === "NEED_INFO") {
            updateData.adminNotes = notes;
        } else if (status === "APPROVED") {
            updateData.adminNotes = notes;

            // Create visa when approved
            const products = await storage.getVisaProducts();
            const product = products.find(p => p.type === application.visaType);
            const duration = product ? product.durationDays : 30;

            const arrivalDate = application.arrivalDate ? new Date(application.arrivalDate) : new Date();
            const validFrom = arrivalDate;
            const validTo = new Date(validFrom);
            validTo.setDate(validTo.getDate() + duration);

            // Get next visa sequence
            const visaSeq = await storage.getNextApplicationSequence();

            await storage.createVisa({
                applicationId: application.id,
                visaNumber: generateVisaNumber(visaSeq),
                verificationCode: generateVerificationCode(),
                validFrom: validFrom.toISOString().split('T')[0],
                validTo: validTo.toISOString().split('T')[0],
                stayDuration: duration,
                pdfUrl: `/api/visas/${application.id}/pdf`,
            });

            updateData.status = "ISSUED";
        }

        const updatedApp = await storage.updateApplication(id, updateData);

        // Create audit log
        await storage.createAuditLog({
            action: `APPLICATION_${status}`,
            entityType: "application",
            entityId: id,
            actorId: null,
            actorName: "Admin DGM",
            metadata: { previousStatus: application.status, newStatus: status, notes },
        });

        res.json(updatedApp);
    } catch (error) {
        console.error("Error updating application status:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
