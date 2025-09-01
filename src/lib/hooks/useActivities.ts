import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import type { Activity } from "@/lib/db/schema";

interface CreateActivityData {
  activityTypeId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  distance?: number;
  caloriesBurned?: number;
  heartRateAvg?: number;
  heartRateMax?: number;
  notes?: string;
  metrics?: Record<string, number>;
}

export function useActivities(limit = 20) {
  return useInfiniteQuery({
    queryKey: ["activities", limit],
    queryFn: async ({ pageParam = 0 }): Promise<{ activities: Activity[] }> => {
      const response = await fetch(
        `/api/activities?limit=${limit}&offset=${pageParam}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch activities");
      }
      return response.json();
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.activities.length === limit
        ? pages.length * limit
        : undefined;
    },
    initialPageParam: 0,
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: CreateActivityData
    ): Promise<{ activity: Activity }> => {
      const response = await fetch("/api/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create activity");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useUpdateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateActivityData>;
    }): Promise<{ activity: Activity }> => {
      const response = await fetch(`/api/activities/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update activity");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<{ success: boolean }> => {
      const response = await fetch(`/api/activities/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete activity");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}
