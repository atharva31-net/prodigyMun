import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRegistrationSchema } from "@shared/schema";
import { z } from "zod";

const adminCredentials = {
  username: "admin",
  password: "munprodiy#123@12@12"
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (username === adminCredentials.username && password === adminCredentials.password) {
        res.json({ success: true, message: "Login successful" });
      } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  // Create registration
  app.post("/api/registrations", async (req, res) => {
    try {
      const validatedData = insertRegistrationSchema.parse(req.body);
      
      // Check for duplicate registration
      const existingRegistration = await storage.getRegistrationByNameAndClass(
        validatedData.name,
        validatedData.class,
        validatedData.division
      );
      
      if (existingRegistration) {
        return res.status(400).json({ 
          success: false, 
          message: "Student is already registered for MUN" 
        });
      }
      
      const registration = await storage.createRegistration(validatedData);
      res.json({ success: true, registration });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid registration data",
          errors: error.errors
        });
      } else {
        res.status(500).json({ success: false, message: "Server error" });
      }
    }
  });

  // Get all registrations (admin only)
  app.get("/api/registrations", async (req, res) => {
    try {
      const registrations = await storage.getAllRegistrations();
      res.json({ success: true, registrations });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  // Get registration statistics
  app.get("/api/registrations/stats", async (req, res) => {
    try {
      const stats = await storage.getRegistrationStats();
      res.json({ success: true, stats });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
