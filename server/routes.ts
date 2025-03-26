import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertAppointmentSchema, insertTreatmentStageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get('/api/users', async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to get users" });
    }
  });

  app.get('/api/users/:id', async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.post('/api/users', async (req, res) => {
    try {
      const parsedBody = insertUserSchema.parse(req.body);
      const newUser = await storage.createUser(parsedBody);
      res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Appointment routes
  app.get('/api/appointments', async (req, res) => {
    try {
      const appointments = await storage.getAllAppointments();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Failed to get appointments" });
    }
  });

  app.get('/api/appointments/:id', async (req, res) => {
    try {
      const appointment = await storage.getAppointment(parseInt(req.params.id));
      
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ message: "Failed to get appointment" });
    }
  });

  app.get('/api/users/:userId/appointments', async (req, res) => {
    try {
      const appointments = await storage.getUserAppointments(parseInt(req.params.userId));
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user appointments" });
    }
  });

  app.post('/api/appointments', async (req, res) => {
    try {
      const parsedBody = insertAppointmentSchema.parse(req.body);
      const newAppointment = await storage.createAppointment(parsedBody);
      res.status(201).json(newAppointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid appointment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create appointment" });
    }
  });

  app.patch('/api/appointments/:id/status', async (req, res) => {
    try {
      const statusSchema = z.object({
        status: z.enum(["pending", "confirmed", "cancelled", "completed"])
      });
      
      const { status } = statusSchema.parse(req.body);
      const updatedAppointment = await storage.updateAppointmentStatus(parseInt(req.params.id), status);
      
      if (!updatedAppointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      res.json(updatedAppointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid status", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update appointment status" });
    }
  });

  // Treatment stages routes
  app.get('/api/treatment-stages', async (req, res) => {
    try {
      const stages = await storage.getAllTreatmentStages();
      res.json(stages);
    } catch (error) {
      res.status(500).json({ message: "Failed to get treatment stages" });
    }
  });

  app.get('/api/users/:userId/treatment-stages', async (req, res) => {
    try {
      const stages = await storage.getUserTreatmentStages(parseInt(req.params.userId));
      res.json(stages);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user treatment stages" });
    }
  });

  app.post('/api/treatment-stages', async (req, res) => {
    try {
      const parsedBody = insertTreatmentStageSchema.parse(req.body);
      const newStage = await storage.createTreatmentStage(parsedBody);
      res.status(201).json(newStage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid treatment stage data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create treatment stage" });
    }
  });

  app.patch('/api/treatment-stages/:id', async (req, res) => {
    try {
      const updateSchema = z.object({
        stage: z.string().optional(),
        notes: z.string().optional(),
      });
      
      const updateData = updateSchema.parse(req.body);
      const updatedStage = await storage.updateTreatmentStage(parseInt(req.params.id), updateData);
      
      if (!updatedStage) {
        return res.status(404).json({ message: "Treatment stage not found" });
      }
      
      res.json(updatedStage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid update data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update treatment stage" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
