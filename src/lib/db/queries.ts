import { eq, desc, and, gte, lte, count, sql } from "drizzle-orm";
import { db } from "./index";
import { sportProfiles, activities, goals, activityTypes } from "./schema";
import type { SportProfile, Activity, Goal } from "./schema";

export class DatabaseQueries {
  // Profil sportif
  static async getSportProfileByUserId(
    userId: string
  ): Promise<SportProfile | null> {
    const result = await db
      .select()
      .from(sportProfiles)
      .where(eq(sportProfiles.userId, userId))
      .limit(1);

    return result[0] || null;
  }

  static async createSportProfile(
    data: typeof sportProfiles.$inferInsert
  ): Promise<SportProfile> {
    const result = await db.insert(sportProfiles).values(data).returning();
    return result[0];
  }

  static async updateSportProfile(
    userId: string,
    data: Partial<typeof sportProfiles.$inferInsert>
  ): Promise<SportProfile> {
    const result = await db
      .update(sportProfiles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(sportProfiles.userId, userId))
      .returning();

    return result[0];
  }

  // Activités
  static async getActivitiesByUserId(
    userId: string,
    limit = 20,
    offset = 0
  ): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.startTime))
      .limit(limit)
      .offset(offset);
  }

  static async createActivity(
    data: typeof activities.$inferInsert
  ): Promise<Activity> {
    const result = await db.insert(activities).values(data).returning();
    return result[0];
  }

  static async updateActivity(
    id: string,
    data: Partial<typeof activities.$inferInsert>
  ): Promise<Activity> {
    const result = await db
      .update(activities)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(activities.id, id))
      .returning();

    return result[0];
  }

  static async deleteActivity(id: string, userId: string): Promise<void> {
    await db
      .delete(activities)
      .where(and(eq(activities.id, id), eq(activities.userId, userId)));
  }

  // Statistiques
  static async getActivityStats(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ) {
    const conditions = [eq(activities.userId, userId)];

    if (startDate) conditions.push(gte(activities.startTime, startDate));
    if (endDate) conditions.push(lte(activities.startTime, endDate));

    const stats = await db
      .select({
        totalActivities: count(),
        totalDuration: sql<number>`sum(${activities.duration})`,
        totalDistance: sql<number>`sum(${activities.distance})`,
        totalCalories: sql<number>`sum(${activities.caloriesBurned})`,
        avgHeartRate: sql<number>`avg(${activities.heartRateAvg})`,
      })
      .from(activities)
      .where(and(...conditions));

    return stats[0];
  }

  static async getWeeklyStats(userId: string) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return await this.getActivityStats(userId, oneWeekAgo);
  }

  static async getMonthlyStats(userId: string) {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    return await this.getActivityStats(userId, oneMonthAgo);
  }

  // Objectifs
  static async getGoalsByUserId(userId: string): Promise<Goal[]> {
    return await db
      .select()
      .from(goals)
      .where(eq(goals.userId, userId))
      .orderBy(desc(goals.createdAt));
  }

  static async createGoal(data: typeof goals.$inferInsert): Promise<Goal> {
    const result = await db.insert(goals).values(data).returning();
    return result[0];
  }

  static async updateGoal(
    id: string,
    data: Partial<typeof goals.$inferInsert>
  ): Promise<Goal> {
    const result = await db
      .update(goals)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(goals.id, id))
      .returning();

    return result[0];
  }

  static async deleteGoal(id: string, userId: string): Promise<void> {
    await db
      .delete(goals)
      .where(and(eq(goals.id, id), eq(goals.userId, userId)));
  }

  // Types d'activités
  static async getActivityTypes() {
    return await db
      .select()
      .from(activityTypes)
      .where(eq(activityTypes.isActive, true))
      .orderBy(activityTypes.name);
  }
}
