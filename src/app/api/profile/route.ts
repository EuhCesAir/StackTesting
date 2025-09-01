import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/server";
import { DatabaseQueries } from "@/lib/db/queries";
import { createSportProfileSchema } from "@/lib/validations/api";
import { ZodError } from "zod";

export async function GET() {
  try {
    const session = await requireAuth();
    const profile = await DatabaseQueries.getSportProfileByUserId(
      session.user.id
    );

    return NextResponse.json({ profile });
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

    const validatedData = createSportProfileSchema.parse(body);

    const profile = await DatabaseQueries.createSportProfile({
      userId: session.user.id,
      ...validatedData,
      weight:
        validatedData.weight !== undefined
          ? String(validatedData.weight)
          : undefined,
    });

    return NextResponse.json({ profile }, { status: 201 });
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

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();

    const validatedData = createSportProfileSchema.parse(body);

    const profile = await DatabaseQueries.updateSportProfile(session.user.id, {
      ...validatedData,
      weight:
        validatedData.weight !== undefined
          ? String(validatedData.weight)
          : undefined,
    });

    return NextResponse.json({ profile });
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
