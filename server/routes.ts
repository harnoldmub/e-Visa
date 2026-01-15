import type { Express } from "express";
import type { Server } from "http";
import { registerPublicRoutes } from "./routes/public.routes";
import { registerAdminRoutes } from "./routes/admin.routes";
import { registerVisaRoutes } from "./routes/visa.routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Register all route modules
  registerPublicRoutes(app);
  registerAdminRoutes(app);
  registerVisaRoutes(app);

  return httpServer;
}
