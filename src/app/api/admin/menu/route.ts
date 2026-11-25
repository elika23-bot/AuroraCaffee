import { NextRequest, NextResponse } from "next/server";
import { ValidationError, createMenuItem, validateMenuItem } from "@/lib/menu";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  try {
    const input = validateMenuItem(body);
    const item = await createMenuItem(input);
    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch (err) {
    if (err instanceof ValidationError) {
      return NextResponse.json(
        { ok: false, message: "Please fix the highlighted fields.", fields: err.fields },
        { status: 422 }
      );
    }
    console.error("[api/admin/menu] unexpected error", err);
    return NextResponse.json({ ok: false, message: "Something went wrong." }, { status: 500 });
  }
}
