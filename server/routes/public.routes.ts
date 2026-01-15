import type { Express } from "express";
import { upload, getRelativeFilePath } from "../utils/upload";
import * as applicationsController from "../controllers/applications.controller";

export function registerPublicRoutes(app: Express) {
    // Get Visa Products (Pricing/Types)
    app.get("/api/visa-products", applicationsController.getVisaProducts);

    // Create a Draft Application (Email/Identity Step)
    app.post("/api/applications/draft", applicationsController.createDraftApplication);

    // Get Application by ID (for resuming)
    app.get("/api/applications/:id", applicationsController.getApplication);

    // Update Application (General Update for any info)
    app.patch("/api/applications/:id", applicationsController.updateApplication);

    // Upload files for application
    app.post(
        "/api/applications/:id/upload",
        upload.fields([
            { name: "photo", maxCount: 1 },
            { name: "passport", maxCount: 1 },
        ]),
        async (req, res) => {
            try {
                const { id } = req.params;
                const files = req.files as { [fieldname: string]: Express.Multer.File[] };

                const updateData: any = {};

                if (files.photo && files.photo[0]) {
                    updateData.photoPath = getRelativeFilePath(files.photo[0].path);
                }

                if (files.passport && files.passport[0]) {
                    updateData.passportCopyPath = getRelativeFilePath(files.passport[0].path);
                }

                // Import storage dynamically to avoid circular dependency
                const { storage } = await import("../storage");
                const updatedApp = await storage.updateApplication(id, updateData);

                res.json({
                    success: true,
                    application: updatedApp,
                    files: {
                        photo: files.photo?.[0]?.filename,
                        passport: files.passport?.[0]?.filename,
                    },
                });
            } catch (error: any) {
                console.error("Error uploading files:", error);
                res.status(500).json({ error: error.message || "Error uploading files" });
            }
        }
    );

    // Track application by reference number AND email
    app.get("/api/applications/track/:ref", applicationsController.trackApplication);
}
