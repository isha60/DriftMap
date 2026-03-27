import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const year = searchParams.get("year")

    const filter: Record<string, unknown> = { userId: new ObjectId(session.userId) }
    if (category && category !== "all") filter.category = category
    if (year && year !== "all") {
      const y = parseInt(year)
      filter.date = {
        $gte: new Date(y, 0, 1),
        $lt: new Date(y + 1, 0, 1),
      }
    }

    const entries = await db
      .collection("entries")
      .find(filter)
      .sort({ date: -1 })
      .toArray()

    return NextResponse.json({
      entries: entries.map((e) => ({
        _id: e._id.toString(),
        title: e.title,
        description: e.description,
        date: e.date,
        category: e.category,
        mood: e.mood,
        tags: e.tags || [],
        createdAt: e.createdAt,
      })),
    })
  } catch (error) {
    console.error("Get entries error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, date, category, mood, tags } = await req.json()

    if (!title || !date || !category) {
      return NextResponse.json({ error: "Title, date, and category are required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const entry = {
      userId: new ObjectId(session.userId),
      title,
      description: description || "",
      date: new Date(date),
      category,
      mood: mood || "neutral",
      tags: tags || [],
      createdAt: new Date(),
    }

    const result = await db.collection("entries").insertOne(entry)

    return NextResponse.json({
      entry: {
        _id: result.insertedId.toString(),
        ...entry,
        userId: undefined,
      },
    })
  } catch (error) {
    console.error("Create entry error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
