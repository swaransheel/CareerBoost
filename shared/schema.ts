import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // Full-time, Part-time, Remote, Contract
  salary: text("salary"),
  skills: text("skills").array(),
  postedDate: timestamp("posted_date").defaultNow(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => jobs.id).notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  resumeUrl: text("resume_url").notNull(),
  coverLetter: text("cover_letter").notNull(),
  experience: text("experience"),
  startDate: text("start_date"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  status: text("status").default('pending'),
});

export const jobsRelations = relations(jobs, ({ many }) => ({
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  job: one(jobs, {
    fields: [applications.jobId],
    references: [jobs.id],
  }),
}));

export const applicationFormSchema = z.object({
  firstName: z.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s-]+$/, "First name can only contain letters, spaces, and hyphens"),
  lastName: z.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s-]+$/, "Last name can only contain letters, spaces, and hyphens"),
  email: z.string()
    .email("Please enter a valid email address")
    .min(5, "Email is too short")
    .max(100, "Email must not exceed 100 characters"),
  phone: z.string()
    .regex(/^(\+\d{1,3})?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  resumeUrl: z.string()
    .url("Please enter a valid URL")
    .max(500, "URL is too long"),
  coverLetter: z.string()
    .min(100, "Cover letter must be at least 100 characters")
    .max(5000, "Cover letter must not exceed 5000 characters"),
  experience: z.string()
    .min(10, "Experience description must be at least 10 characters")
    .max(1000, "Experience must not exceed 1000 characters")
    .optional()
    .or(z.literal("")),
  startDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date in YYYY-MM-DD format")
    .optional()
    .or(z.literal("")),
  jobId: z.number().positive("Invalid job ID"),
});

export type ApplicationFormData = z.infer<typeof applicationFormSchema>;

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  postedDate: true,
});

export const insertApplicationSchema = applicationFormSchema;

// Types
export type Application = typeof applications.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type InsertApplication = typeof applications.$inferInsert;
export type InsertJob = typeof jobs.$inferInsert;
export type ApplicationWithJob = Application & { job: Job };
export type ApplicationStatus = 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
