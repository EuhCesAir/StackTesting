import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/server";
import { DatabaseQueries } from "@/lib/db/queries";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "week";

    let stats;
    if (period === "week") {
      stats = await DatabaseQueries.getWeeklyStats(session.user.id);
    } else if (period === "month") {
      stats = await DatabaseQueries.getMonthlyStats(session.user.id);
    } else {
      const startDate = searchParams.get("startDate")
        ? new Date(searchParams.get("startDate")!)
        : undefined;
      const endDate = searchParams.get("endDate")
        ? new Date(searchParams.get("endDate")!)
        : undefined;

      stats = await DatabaseQueries.getActivityStats(
        session.user.id,
        startDate,
        endDate
      );
    }

    return NextResponse.json({ stats });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
