import { jobs, applications, type Job, type Application, type InsertJob, type InsertApplication } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export type ApplicationStatus = 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
export type ApplicationWithJob = Application & { job: Job };

export interface IStorage {
  // Job methods
  getAllJobs(): Promise<Job[]>;
  getJobById(id: number): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  
  // Application methods
  createApplication(application: InsertApplication): Promise<Application>;
  getApplicationsByJobId(jobId: number): Promise<Application[]>;
  getAllApplications(): Promise<ApplicationWithJob[]>;
  withdrawApplication(id: number): Promise<boolean>;
  getApplicationById(id: number): Promise<Application | undefined>;
  updateApplicationStatus(id: number, status: ApplicationStatus): Promise<boolean>;
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

  async getAllApplications(): Promise<ApplicationWithJob[]> {
    const results = await db
      .select()
      .from(applications)
      .leftJoin(jobs, eq(applications.jobId, jobs.id));

    return results
      .filter((row) => row.jobs !== null)
      .map((row) => ({
        id: row.applications.id,
        jobId: row.applications.jobId,
        firstName: row.applications.firstName,
        lastName: row.applications.lastName,
        email: row.applications.email,
        phone: row.applications.phone,
        resumeUrl: row.applications.resumeUrl,
        coverLetter: row.applications.coverLetter,
        experience: row.applications.experience,
        startDate: row.applications.startDate,
        submittedAt: row.applications.submittedAt,
        status: row.applications.status as ApplicationStatus,
        job: row.jobs!
      }));
  }

  async getApplicationById(id: number): Promise<Application | undefined> {
    const [application] = await db
      .select()
      .from(applications)
      .where(eq(applications.id, id));
    return application || undefined;
  }

  async withdrawApplication(id: number): Promise<boolean> {
    const result = await db
      .delete(applications)
      .where(eq(applications.id, id))
      .returning();
    return result.length > 0;
  }

  async updateApplicationStatus(id: number, status: ApplicationStatus): Promise<boolean> {
    const result = await db
      .update(applications)
      .set({ status })
      .where(eq(applications.id, id))
      .returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
