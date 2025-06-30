import { users, registrations, type User, type InsertUser, type Registration, type InsertRegistration } from "@shared/schema";
import { db } from "./db";
import { eq, and, count, inArray, or } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  
  // Registration methods
  getRegistrationByNameAndClass(name: string, class_: string, division: string): Promise<Registration | undefined>;
  createRegistration(insertRegistration: InsertRegistration): Promise<Registration>;
  getAllRegistrations(): Promise<Registration[]>;
  updateRegistrationStatus(id: number, status: string): Promise<Registration>;
  deleteRegistration(id: number): Promise<void>;
  getRegistrationStats(): Promise<{
    total: number;
    indianCommittees: number;
    internationalCommittees: number;
    seniorStudents: number;
    pending: number;
    confirmed: number;
    rejected: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getRegistrationByNameAndClass(name: string, class_: string, division: string): Promise<Registration | undefined> {
    const [registration] = await db
      .select()
      .from(registrations)
      .where(
        and(
          eq(registrations.name, name),
          eq(registrations.class, class_),
          eq(registrations.division, division)
        )
      );
    return registration || undefined;
  }

  async createRegistration(insertRegistration: InsertRegistration): Promise<Registration> {
    const [registration] = await db
      .insert(registrations)
      .values(insertRegistration)
      .returning();
    return registration;
  }

  async getAllRegistrations(): Promise<Registration[]> {
    return await db.select().from(registrations).orderBy(registrations.createdAt);
  }

  async updateRegistrationStatus(id: number, status: string): Promise<Registration> {
    const [registration] = await db
      .update(registrations)
      .set({ status })
      .where(eq(registrations.id, id))
      .returning();
    return registration;
  }

  async deleteRegistration(id: number): Promise<void> {
    await db
      .delete(registrations)
      .where(eq(registrations.id, id));
  }

  async getRegistrationStats(): Promise<{
    total: number;
    indianCommittees: number;
    internationalCommittees: number;
    seniorStudents: number;
    pending: number;
    confirmed: number;
    rejected: number;
  }> {
    const indianCommitteeIds = ['lok-sabha', 'rajya-sabha', 'niti-aayog', 'supreme-court', 'cabinet', 'assembly'];
    
    const [totalResult] = await db.select({ count: count() }).from(registrations);
    
    const [indianResult] = await db
      .select({ count: count() })
      .from(registrations)
      .where(
        or(
          eq(registrations.committee, 'lok-sabha'),
          eq(registrations.committee, 'rajya-sabha'),
          eq(registrations.committee, 'niti-aayog'),
          eq(registrations.committee, 'supreme-court'),
          eq(registrations.committee, 'cabinet'),
          eq(registrations.committee, 'assembly')
        )
      );
    
    const [seniorResult] = await db
      .select({ count: count() })
      .from(registrations)
      .where(
        or(
          eq(registrations.class, '11th'),
          eq(registrations.class, '12th')
        )
      );

    const [pendingResult] = await db
      .select({ count: count() })
      .from(registrations)
      .where(eq(registrations.status, 'pending'));

    const [confirmedResult] = await db
      .select({ count: count() })
      .from(registrations)
      .where(eq(registrations.status, 'confirmed'));

    const [rejectedResult] = await db
      .select({ count: count() })
      .from(registrations)
      .where(eq(registrations.status, 'rejected'));

    const total = totalResult.count;
    const indian = indianResult.count;
    const senior = seniorResult.count;
    const pending = pendingResult.count;
    const confirmed = confirmedResult.count;
    const rejected = rejectedResult.count;

    return {
      total,
      indianCommittees: indian,
      internationalCommittees: total - indian,
      seniorStudents: senior,
      pending,
      confirmed,
      rejected,
    };
  }
}

export const storage = new DatabaseStorage();