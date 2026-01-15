import type { Express } from "express";
import * as visaController from "../controllers/visa.controller";

export function registerVisaRoutes(app: Express) {
    // Generate Visa PDF - Official DGM Format
    app.get("/api/visas/:id/pdf", visaController.downloadVisaPdf);
}
