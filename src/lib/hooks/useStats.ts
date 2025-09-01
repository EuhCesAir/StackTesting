import { useQuery } from "@tanstack/react-query";

interface ActivityStats {
  totalActivities: number;
  totalDuration: number;
  totalDistance: number;
  totalCalories: number;
  avgHeartRate: number;
}

export function useStats(
  period: "week" | "month" | "custom" = "week",
  startDate?: string,
  endDate?: string
) {
  return useQuery({
    queryKey: ["stats", period, startDate, endDate],
    queryFn: async (): Promise<{ stats: ActivityStats }> => {
      const params = new URLSearchParams({ period });

      if (period === "custom" && startDate && endDate) {
        params.append("startDate", startDate);
        params.append("endDate", endDate);
      }

      const response = await fetch(`/api/stats?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }
      return response.json();
    },
  });
}
