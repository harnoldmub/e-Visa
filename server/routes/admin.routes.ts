import type { Express } from "express";
import * as adminController from "../controllers/admin.controller";

export function registerAdminRoutes(app: Express) {
    // Admin login
    app.post("/api/admin/login", adminController.adminLogin);

    // Get dashboard stats
    app.get("/api/admin/stats", adminController.getDashboardStats);

    // Get all applications (admin)
    app.get("/api/admin/applications", adminController.getAllApplications);

    // Get single application (admin)
    app.get("/api/admin/applications/:id", adminController.getApplicationById);

    // Update application status (admin)
    app.patch("/api/admin/applications/:id/status", adminController.updateApplicationStatus);
}
