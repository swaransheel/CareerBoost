import { jobs, applications, type Job, type Application, type InsertJob, type InsertApplication } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Job methods
  getAllJobs(): Promise<Job[]>;
  getJobById(id: number): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  
  // Application methods
  createApplication(application: InsertApplication): Promise<Application>;
  getApplicationsByJobId(jobId: number): Promise<Application[]>;
  getAllApplications(): Promise<Application[]>;
}

export class DatabaseStorage implements IStorage {
  async getAllJobs(): Promise<Job[]> {
    return await db.select().from(jobs).orderBy(jobs.postedDate);
  }

  async getJobById(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job || undefined;
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const [job] = await db
      .insert(jobs)
      .values(insertJob)
      .returning();
    return job;
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const [application] = await db
      .insert(applications)
      .values(insertApplication)
      .returning();
    return application;
  }

  async getApplicationsByJobId(jobId: number): Promise<Application[]> {
    return await db
      .select()
      .from(applications)
      .where(eq(applications.jobId, jobId));
  }

  async getAllApplications(): Promise<Application[]> {
    return await db.select().from(applications);
  }
}

export const storage = new DatabaseStorage();
