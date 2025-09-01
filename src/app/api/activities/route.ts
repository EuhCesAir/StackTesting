import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/server";
import { DatabaseQueries } from "@/lib/db/queries";
import { createActivitySchema } from "@/lib/validations/api";
import { ZodError } from "zod";

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || 20;
    const offset = Number(searchParams.get("offset")) || 0;

    const activities = await DatabaseQueries.getActivitiesByUserId(
      session.user.id,
      limit,
      offset
    );

    return NextResponse.json({ activities });
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

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();

    const validatedData = createActivitySchema.parse(body);

    // Convert distance to string if present
    const fixedData = {
      ...validatedData,
      distance:
        validatedData.distance !== undefined && validatedData.distance !== null
          ? String(validatedData.distance)
          : (validatedData.distance ?? null),
    };

    const activity = await DatabaseQueries.createActivity({
      userId: session.user.id,
      ...fixedData,
    });

    return NextResponse.json({ activity }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
