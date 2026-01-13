import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { visaTypeLabels } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // ============================================
  // PUBLIC ROUTES
  // ============================================

  // Submit a new visa application
  app.post("/api/applications", async (req, res) => {
    try {
      const body = req.body;
      
      // Validate required fields
      if (!body.visaType || !body.firstName || !body.lastName || !body.email) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Create the application with validated data
      const application = await storage.createApplication({
        visaType: body.visaType,
        status: "SUBMITTED",
        codeInstitution: body.codeInstitution || null,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone || "",
        phoneCountryCode: body.phoneCountryCode || "+243",
        nationality: body.nationality || "",
        countryOfOrigin: body.countryOfOrigin || "",
        dateOfBirth: body.dateOfBirth || "",
        placeOfBirth: body.placeOfBirth || "",
        gender: body.gender || "",
        civilStatus: body.civilStatus || "",
        occupation: body.occupation || "",
        address: body.address || "",
        passportNumber: body.passportNumber || "",
        passportExpiryDate: body.passportExpiryDate || "",
        arrivalDate: body.arrivalDate || "",
        purposeOfVisit: body.purposeOfVisit || "",
        photoId: body.photoId || null,
        passportScan: body.passportScan || null,
        // Sponsor info
        sponsorFirstName: body.sponsorFirstName || null,
        sponsorLastName: body.sponsorLastName || null,
        sponsorPlaceOfBirth: body.sponsorPlaceOfBirth || null,
        sponsorDateOfBirth: body.sponsorDateOfBirth || null,
        sponsorGender: body.sponsorGender || null,
        sponsorIdNumber: body.sponsorIdNumber || null,
        sponsorIdExpiry: body.sponsorIdExpiry || null,
        sponsorIdIssuedBy: body.sponsorIdIssuedBy || null,
        sponsorCivilStatus: body.sponsorCivilStatus || null,
        sponsorAddress: body.sponsorAddress || null,
        sponsorNationality: body.sponsorNationality || null,
        sponsorEmail: body.sponsorEmail || null,
        sponsorPhone: body.sponsorPhone || null,
        sponsorPhoneCountryCode: body.sponsorPhoneCountryCode || "+243",
        sponsorRelation: body.sponsorRelation || null,
        sponsorRequestLetter: body.sponsorRequestLetter || null,
        sponsorPassportScan: body.sponsorPassportScan || null,
        sponsorVisaScan: body.sponsorVisaScan || null,
        paymentStatus: "PENDING",
        adminNotes: null,
        rejectionReason: null,
      });

      // Create payment record
      const visaInfo = visaTypeLabels[body.visaType as keyof typeof visaTypeLabels];
      const amount = visaInfo ? visaInfo.price + 5 : 55; // visa price + service fee

      await storage.createPayment({
        applicationId: application.id,
        provider: "MPESA",
        phoneNumber: body.phoneNumber || "",
        amount,
        currency: "USD",
        status: "PENDING",
        transactionId: null,
        paidAt: null,
      });

      // Simulate payment success (in production, this would be async with M-Pesa API)
      setTimeout(async () => {
        const payment = await storage.getPaymentByApplicationId(application.id);
        if (payment) {
          await storage.updatePayment(payment.id, {
            status: "PAID",
            transactionId: `TXN-${Date.now()}`,
            paidAt: new Date(),
          });
          await storage.updateApplication(application.id, {
            paymentStatus: "PAID",
          });
        }
      }, 2000);

      // Create audit log
      await storage.createAuditLog({
        action: "APPLICATION_SUBMITTED",
        entityType: "application",
        entityId: application.id,
        actorId: null,
        actorName: `${body.firstName} ${body.lastName}`,
        metadata: { applicationNumber: application.applicationNumber },
      });

      res.status(201).json(application);
    } catch (error) {
      console.error("Error creating application:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Track application by reference number
  app.get("/api/applications/track/:ref", async (req, res) => {
    try {
      const { ref } = req.params;
      const application = await storage.getApplicationByNumber(ref);
      
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      res.json(application);
    } catch (error) {
      console.error("Error tracking application:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Verify e-Visa by code
  app.get("/api/verify/:code", async (req, res) => {
    try {
      const { code } = req.params;
      const visa = await storage.getVisaByVerificationCode(code);
      
      if (!visa) {
        return res.status(404).json({ error: "Visa not found" });
      }

      const application = await storage.getApplication(visa.applicationId);
      
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      const now = new Date();
      const validTo = new Date(visa.validTo);
      const isValid = validTo > now && application.status === "ISSUED";

      res.json({
        visa,
        application,
        isValid,
      });
    } catch (error) {
      console.error("Error verifying visa:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============================================
  // ADMIN ROUTES
  // ============================================

  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // In production, we would create a JWT token here
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
  });

  // Get dashboard stats
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error getting stats:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all applications (admin)
  app.get("/api/admin/applications", async (req, res) => {
    try {
      const applications = await storage.getApplications();
      res.json(applications);
    } catch (error) {
      console.error("Error getting applications:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get single application (admin)
  app.get("/api/admin/applications/:id", async (req, res) => {
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
  });

  // Update application status (admin)
  app.patch("/api/admin/applications/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

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
        const visaInfo = visaTypeLabels[application.visaType as keyof typeof visaTypeLabels];
        const duration = visaInfo ? visaInfo.duration : 30;
        
        const arrivalDate = application.arrivalDate ? new Date(application.arrivalDate) : new Date();
        const validFrom = arrivalDate;
        const validTo = new Date(validFrom);
        validTo.setDate(validTo.getDate() + duration);

        // Create visa with auto-generated visaNumber and verificationCode
        await storage.createVisa({
          applicationId: application.id,
          visaNumber: `VISA-${Date.now()}`, // Will be overwritten by storage
          verificationCode: `CODE-${Date.now()}`, // Will be overwritten by storage
          validFrom: validFrom.toISOString().split('T')[0],
          validTo: validTo.toISOString().split('T')[0],
          stayDuration: duration,
          pdfUrl: `/api/visas/${application.id}/pdf`,
        });

        // Update status to ISSUED after visa creation
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
  });

  // Issue visa (generate PDF)
  app.post("/api/admin/applications/:id/issue", async (req, res) => {
    try {
      const { id } = req.params;
      
      const application = await storage.getApplication(id);
      
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      if (application.status !== "APPROVED") {
        return res.status(400).json({ error: "Application must be approved first" });
      }

      const visa = await storage.getVisaByApplicationId(id);
      
      if (!visa) {
        return res.status(404).json({ error: "Visa not found" });
      }

      // Update application status to ISSUED
      await storage.updateApplication(id, { status: "ISSUED" });

      // Create audit log
      await storage.createAuditLog({
        action: "VISA_ISSUED",
        entityType: "visa",
        entityId: visa.id,
        actorId: null,
        actorName: "Admin DGM",
        metadata: { visaNumber: visa.visaNumber, applicationId: id },
      });

      res.json({ visa, application: await storage.getApplication(id) });
    } catch (error) {
      console.error("Error issuing visa:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return httpServer;
}
