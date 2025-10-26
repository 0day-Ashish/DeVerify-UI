import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const EMAIL_RE =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = (body?.email ?? "").toString().trim().toLowerCase();

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const client = await clientPromise;
    const dbName = process.env.MONGODB_DB ?? "hackathons";
    const db = client.db(dbName);
    const coll = db.collection("subscription-emails");

    // ensure we don't create duplicates; set createdAt only on insert
    await coll.updateOne(
      { email },
      { $setOnInsert: { email, createdAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("POST /api/subscribe error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}