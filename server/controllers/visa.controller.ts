import type { Request, Response } from "express";
import { storage } from "../storage";
import { generateVisaPDF } from "../services/pdf.service";

export async function downloadVisaPdf(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const application = await storage.getApplication(id);
        if (!application || application.status !== "ISSUED") {
            return res.status(404).send("Visa not found or not issued");
        }

        const visa = await storage.getVisaByApplicationId(id);
        if (!visa) return res.status(404).send("Visa record not found");

        // Generate PDF with Puppeteer
        const pdfBuffer = await generateVisaPDF(application);

        // Send PDF to client for inline display (open in browser)
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="e-Visa-${application.applicationNumber}.pdf"`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error("Error generating PDF:", error);
        if (!res.headersSent) res.status(500).send("Error generating PDF");
    }
}
