import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertJobSchema, insertApplicationSchema } from "@shared/schema";
import { z } from "zod";
import type { ApplicationStatus } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // GET /api/jobs - Get all jobs
  app.get("/api/jobs", async (req, res) => {
    try {
      const jobs = await storage.getAllJobs();
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // GET /api/jobs/:id - Get job by ID
  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid job ID" });
      }

      const job = await storage.getJobById(id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      res.json(job);
    } catch (error) {
      console.error("Error fetching job:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // POST /api/applications - Submit application
  app.post("/api/applications", async (req, res) => {
    try {
      const validatedData = insertApplicationSchema.parse(req.body);
      
      // Verify job exists
      const job = await storage.getJobById(validatedData.jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      const application = await storage.createApplication(validatedData);
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid application data", errors: error.errors });
      }
      console.error("Error creating application:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // GET /api/applications - Get all applications (for admin)
  app.get("/api/applications", async (req, res) => {
    try {
      const applications = await storage.getAllApplications();
      res.json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // GET /api/admin/applications - Get all applications with job details (admin only)
  app.get("/api/admin/applications", async (req, res) => {
    try {
      const applications = await storage.getAllApplications();
      res.json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // DELETE /api/applications/:id - Withdraw application
  app.delete("/api/applications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid application ID" });
      }

      const application = await storage.getApplicationById(id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      const success = await storage.withdrawApplication(id);
      if (success) {
        res.status(200).json({ message: "Application withdrawn successfully" });
      } else {
        res.status(500).json({ message: "Failed to withdraw application" });
      }
    } catch (error) {
      console.error("Error withdrawing application:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // PATCH /api/applications/:id/status - Update application status
  app.patch("/api/applications/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid application ID" });
      }

      const status = req.body.status;
      if (!["pending", "reviewed", "shortlisted", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const application = await storage.getApplicationById(id);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      const success = await storage.updateApplicationStatus(id, status as ApplicationStatus);
      if (success) {
        res.json({ message: "Application status updated successfully" });
      } else {
        res.status(500).json({ message: "Failed to update application status" });
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Seed some initial jobs
  app.post("/api/seed", async (req, res) => {
    try {
      const seedJobs = [
        {
          title: "Senior Frontend Developer",
          company: "TechCorp Inc.",
          location: "San Francisco, CA",
          type: "Full-time",
          salary: "$120k - $160k",
          skills: ["React", "TypeScript", "Node.js"],
          description: "Join our dynamic team to build cutting-edge web applications using React, TypeScript, and modern frontend technologies. We're looking for a passionate developer who can create exceptional user experiences and collaborate effectively with cross-functional teams.\n\nKey Responsibilities:\n• Develop responsive web applications using React and TypeScript\n• Collaborate with UI/UX designers to implement pixel-perfect designs\n• Optimize application performance and user experience\n• Write clean, maintainable, and well-documented code\n• Participate in code reviews and contribute to technical discussions\n\nRequirements:\n• 5+ years of experience in frontend development\n• Strong proficiency in React, TypeScript, and modern JavaScript\n• Experience with state management libraries (Redux, Context API)\n• Knowledge of RESTful APIs and GraphQL\n• Familiarity with testing frameworks (Jest, React Testing Library)"
        },
        {
          title: "Full Stack Engineer",
          company: "StartupXYZ",
          location: "Remote",
          type: "Remote",
          salary: "$100k - $140k",
          skills: ["MongoDB", "Express.js", "React"],
          description: "Build scalable web applications from frontend to backend. Work with MongoDB, Express.js, React, and Node.js in a fast-paced startup environment.\n\nKey Responsibilities:\n• Design and develop full-stack web applications\n• Work with RESTful APIs and database design\n• Collaborate with product team on new features\n• Maintain code quality and best practices\n\nRequirements:\n• 3+ years of full-stack development experience\n• Proficiency in JavaScript, Node.js, and React\n• Experience with MongoDB and Express.js\n• Strong problem-solving skills\n• Ability to work independently in a remote environment"
        },
        {
          title: "Backend Developer",
          company: "DataFlow Solutions",
          location: "New York, NY",
          type: "Part-time",
          salary: "$80k - $100k",
          skills: ["PostgreSQL", "Python", "AWS"],
          description: "Develop robust APIs and database solutions using PostgreSQL, Python, and cloud technologies. Join our team working on data-intensive applications.\n\nKey Responsibilities:\n• Design and implement RESTful APIs\n• Optimize database queries and performance\n• Deploy and maintain applications on AWS\n• Collaborate with frontend developers\n\nRequirements:\n• 4+ years of backend development experience\n• Strong knowledge of PostgreSQL and Python\n• Experience with AWS cloud services\n• Understanding of API design principles\n• Experience with containerization (Docker)"
        }
      ];

      for (const jobData of seedJobs) {
        await storage.createJob(jobData);
      }

      res.json({ message: "Seed data created successfully" });
    } catch (error) {
      console.error("Error seeding data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
