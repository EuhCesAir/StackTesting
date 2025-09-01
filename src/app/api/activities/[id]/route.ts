import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/server";
import { DatabaseQueries } from "@/lib/db/queries";
import { createActivitySchema } from "@/lib/validations/api";
import { ZodError } from "zod";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const body = await request.json();

    const validatedData = createActivitySchema.partial().parse(body);

    // Convert distance to string if present
    const fixedData = {
      ...validatedData,
      distance:
        validatedData.distance !== undefined && validatedData.distance !== null
          ? String(validatedData.distance)
          : (validatedData.distance ?? null),
    };

    const activity = await DatabaseQueries.updateActivity(params.id, fixedData);

    return NextResponse.json({ activity });
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();

    await DatabaseQueries.deleteActivity(params.id, session.user.id);

    return NextResponse.json({ success: true });
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
