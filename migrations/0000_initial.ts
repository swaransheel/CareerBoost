import { sql } from "drizzle-orm";
import { serial, text, timestamp, pgTable } from "drizzle-orm/pg-core";

// Jobs table
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(),
  salary: text("salary"),
  skills: text("skills").array(),
  description: text("description").notNull(),
  postedDate: timestamp("posted_date").default(sql`CURRENT_TIMESTAMP`),
});

// Applications table
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  jobId: serial("job_id").references(() => jobs.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  resumeUrl: text("resume_url").notNull(),
  coverLetter: text("cover_letter").notNull(),
  experience: text("experience"),
  startDate: text("start_date"),
  submittedAt: timestamp("submitted_at").default(sql`CURRENT_TIMESTAMP`),
  status: text("status").default('pending'),
});
