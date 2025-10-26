import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const dbName = process.env.MONGODB_DB ?? "hackathons";
    const db = client.db(dbName);
    const items = await db
      .collection("hack-info")
      .find({})
      .sort({ startDate: -1 })
      .toArray();

    // strip sensitive fields if any, or transform as needed
    const safe = items.map((d) => ({
      ...d,
      _id: d._id?.toString?.() ?? d._id,
    }));

    return NextResponse.json(safe);
  } catch (err) {
    console.error("GET /api/hackathons error", err);
    return NextResponse.json({ error: "failed to fetch" }, { status: 500 });
  }
}