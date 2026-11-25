import { NextRequest, NextResponse } from "next/server";
import { ValidationError, deleteEvent, updateEvent, validateEvent } from "@/lib/events";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  try {
    const input = validateEvent(body);
    const event = await updateEvent(id, input);
    if (!event) {
      return NextResponse.json({ ok: false, message: "Event not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, event });
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json(
        { ok: false, message: "Please fix the highlighted fields.", fields: err.fields },
        { status: 422 }
      );
    }
    console.error("[api/admin/events/:id] unexpected error", err);
    return NextResponse.json({ ok: false, message: "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const deleted = await deleteEvent(id);
  if (!deleted) {
    return NextResponse.json({ ok: false, message: "Event not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
