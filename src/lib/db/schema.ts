import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  decimal,
  timestamp,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Table des utilisateurs
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  image: varchar("image", { length: 500 }),
  emailVerified: timestamp("email_verified"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Profils sportifs
export const sportProfiles = pgTable("sport_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  dateOfBirth: timestamp("date_of_birth"),
  gender: varchar("gender", { length: 20 }),
  height: integer("height"), // en cm
  weight: decimal("weight", { precision: 5, scale: 2 }), // en kg
  activityLevel: varchar("activity_level", { length: 50 }), // sedentary, light, moderate, active, very_active
  primarySports: jsonb("primary_sports").$type<string[]>().default([]),
  fitnessGoals: jsonb("fitness_goals").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Types d'activités sportives
export const activityTypes = pgTable("activity_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // cardio, strength, flexibility, sport
  description: text("description"),
  defaultUnit: varchar("default_unit", { length: 20 }), // minutes, reps, km, etc.
  caloriesPerMinute: decimal("calories_per_minute", { precision: 4, scale: 2 }),
  isActive: boolean("is_active").default(true),
});

// Activités/entraînements
export const activities = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  activityTypeId: uuid("activity_type_id")
    .references(() => activityTypes.id)
    .notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  duration: integer("duration"), // en minutes
  distance: decimal("distance", { precision: 8, scale: 2 }), // en km
  caloriesBurned: integer("calories_burned"),
  heartRateAvg: integer("heart_rate_avg"),
  heartRateMax: integer("heart_rate_max"),
  notes: text("notes"),
  metrics: jsonb("metrics").$type<Record<string, number>>().default({}), // métriques personnalisées
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Objectifs
export const goals = pgTable("goals", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 50 }).notNull(), // weight_loss, muscle_gain, endurance, distance, etc.
  targetValue: decimal("target_value", { precision: 10, scale: 2 }).notNull(),
  currentValue: decimal("current_value", { precision: 10, scale: 2 }).default(
    "0"
  ),
  unit: varchar("unit", { length: 20 }).notNull(), // kg, km, minutes, etc.
  targetDate: timestamp("target_date"),
  status: varchar("status", { length: 20 }).default("active"), // active, completed, paused, cancelled
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Schémas Zod pour la validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertSportProfileSchema = createInsertSchema(sportProfiles, {
  dateOfBirth: z.coerce.date().optional(),
  height: z.number().min(100).max(250).optional(),
  weight: z.number().min(30).max(300).optional(),
  activityLevel: z
    .enum(["sedentary", "light", "moderate", "active", "very_active"])
    .optional(),
  primarySports: z.array(z.string()).default([]),
  fitnessGoals: z.array(z.string()).default([]),
});
export const selectSportProfileSchema = createSelectSchema(sportProfiles);

export const insertActivityTypeSchema = createInsertSchema(activityTypes);
export const selectActivityTypeSchema = createSelectSchema(activityTypes);

export const insertActivitySchema = createInsertSchema(activities, {
  startTime: z.coerce.date(),
  endTime: z.coerce.date().optional(),
  duration: z.number().min(1).optional(),
  distance: z.number().min(0).optional(),
  caloriesBurned: z.number().min(0).optional(),
  heartRateAvg: z.number().min(40).max(220).optional(),
  heartRateMax: z.number().min(40).max(220).optional(),
  metrics: z.record(z.string(), z.number()).default({}),
});
export const selectActivitySchema = createSelectSchema(activities);

export const insertGoalSchema = createInsertSchema(goals, {
  targetValue: z.number().min(0),
  currentValue: z.number().min(0).default(0),
  targetDate: z.coerce.date().optional(),
  status: z
    .enum(["active", "completed", "paused", "cancelled"])
    .default("active"),
});
export const selectGoalSchema = createSelectSchema(goals);

// Types TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type SportProfile = typeof sportProfiles.$inferSelect;
export type NewSportProfile = typeof sportProfiles.$inferInsert;

export type ActivityType = typeof activityTypes.$inferSelect;
export type NewActivityType = typeof activityTypes.$inferInsert;

export type Activity = typeof activities.$inferSelect;
export type NewActivity = typeof activities.$inferInsert;

export type Goal = typeof goals.$inferSelect;
export type NewGoal = typeof goals.$inferInsert;
