import {
  users,
  content,
  socialConnections,
  scheduledPosts,
  analytics,
  type User,
  type UpsertUser,
  type Content,
  type InsertContent,
  type SocialConnection,
  type InsertSocialConnection,
  type ScheduledPost,
  type InsertScheduledPost,
  type Analytics,
  type InsertAnalytics,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Content operations
  createContent(content: InsertContent): Promise<Content>;
  getContentByUserId(userId: string): Promise<Content[]>;
  getContentById(id: string): Promise<Content | undefined>;
  updateContent(id: string, updates: Partial<Content>): Promise<Content>;
  
  // Social connections operations
  getSocialConnections(userId: string): Promise<SocialConnection[]>;
  upsertSocialConnection(connection: InsertSocialConnection): Promise<SocialConnection>;
  
  // Scheduled posts operations
  getScheduledPosts(userId: string): Promise<ScheduledPost[]>;
  createScheduledPost(post: InsertScheduledPost): Promise<ScheduledPost>;
  updateScheduledPost(id: string, updates: Partial<ScheduledPost>): Promise<ScheduledPost>;
  
  // Analytics operations
  getAnalytics(userId: string, startDate?: Date, endDate?: Date): Promise<Analytics[]>;
  upsertAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Content operations
  async createContent(contentData: InsertContent): Promise<Content> {
    const [newContent] = await db
      .insert(content)
      .values(contentData)
      .returning();
    return newContent;
  }

  async getContentByUserId(userId: string): Promise<Content[]> {
    return await db
      .select()
      .from(content)
      .where(eq(content.userId, userId))
      .orderBy(desc(content.createdAt));
  }

  async getContentById(id: string): Promise<Content | undefined> {
    const [contentItem] = await db
      .select()
      .from(content)
      .where(eq(content.id, id));
    return contentItem;
  }

  async updateContent(id: string, updates: Partial<Content>): Promise<Content> {
    const [updatedContent] = await db
      .update(content)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(content.id, id))
      .returning();
    return updatedContent;
  }

  // Social connections operations
  async getSocialConnections(userId: string): Promise<SocialConnection[]> {
    return await db
      .select()
      .from(socialConnections)
      .where(eq(socialConnections.userId, userId));
  }

  async upsertSocialConnection(connectionData: InsertSocialConnection): Promise<SocialConnection> {
    const [connection] = await db
      .insert(socialConnections)
      .values(connectionData)
      .onConflictDoUpdate({
        target: [socialConnections.userId, socialConnections.platform],
        set: {
          ...connectionData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return connection;
  }

  // Scheduled posts operations
  async getScheduledPosts(userId: string): Promise<ScheduledPost[]> {
    return await db
      .select()
      .from(scheduledPosts)
      .where(eq(scheduledPosts.userId, userId))
      .orderBy(scheduledPosts.scheduledTime);
  }

  async createScheduledPost(postData: InsertScheduledPost): Promise<ScheduledPost> {
    const [post] = await db
      .insert(scheduledPosts)
      .values(postData)
      .returning();
    return post;
  }

  async updateScheduledPost(id: string, updates: Partial<ScheduledPost>): Promise<ScheduledPost> {
    const [updatedPost] = await db
      .update(scheduledPosts)
      .set(updates)
      .where(eq(scheduledPosts.id, id))
      .returning();
    return updatedPost;
  }

  // Analytics operations
  async getAnalytics(userId: string, startDate?: Date, endDate?: Date): Promise<Analytics[]> {
    let query = db
      .select()
      .from(analytics)
      .where(eq(analytics.userId, userId));

    if (startDate && endDate) {
      query = query.where(
        and(
          eq(analytics.userId, userId),
          gte(analytics.date, startDate),
          lte(analytics.date, endDate)
        )
      );
    }

    return await query.orderBy(desc(analytics.date));
  }

  async upsertAnalytics(analyticsData: InsertAnalytics): Promise<Analytics> {
    const [analyticsRecord] = await db
      .insert(analytics)
      .values(analyticsData)
      .onConflictDoUpdate({
        target: [analytics.userId, analytics.platform, analytics.date],
        set: {
          ...analyticsData,
          createdAt: new Date(),
        },
      })
      .returning();
    return analyticsRecord;
  }
}

export const storage = new DatabaseStorage();
