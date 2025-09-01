import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { SportProfile } from "@/lib/db/schema";

interface CreateProfileData {
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  height?: number;
  weight?: number;
  activityLevel?: "sedentary" | "light" | "moderate" | "active" | "very_active";
  primarySports?: string[];
  fitnessGoals?: string[];
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<{ profile: SportProfile | null }> => {
      const response = await fetch("/api/profile");
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      return response.json();
    },
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CreateProfileData
    ): Promise<{ profile: SportProfile }> => {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create profile");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: Partial<CreateProfileData>
    ): Promise<{ profile: SportProfile }> => {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}
