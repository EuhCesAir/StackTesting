import { z } from "zod";

export const createSportProfileSchema = z.object({
  dateOfBirth: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  gender: z.enum(["male", "female", "other"]).optional(),
  height: z.number().min(100).max(250).optional(),
  weight: z.number().min(30).max(300).optional(),
  activityLevel: z
    .enum(["sedentary", "light", "moderate", "active", "very_active"])
    .optional(),
  primarySports: z.array(z.string()).default([]),
  fitnessGoals: z.array(z.string()).default([]),
});

export const createActivitySchema = z.object({
  activityTypeId: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  startTime: z.string().transform((val) => new Date(val)),
  endTime: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  duration: z.number().min(1).optional(),
  distance: z.number().min(0).optional(),
  caloriesBurned: z.number().min(0).optional(),
  heartRateAvg: z.number().min(40).max(220).optional(),
  heartRateMax: z.number().min(40).max(220).optional(),
  notes: z.string().optional(),
  metrics: z.record(z.string(), z.number()).default({}),
});

export const createGoalSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  type: z.string().min(1).max(50),
  targetValue: z.number().min(0),
  unit: z.string().min(1).max(20),
  targetDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  isPublic: z.boolean().default(false),
});
