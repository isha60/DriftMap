import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { db } = await connectToDatabase()
    const userId = new ObjectId(session.userId)

    const totalEntries = await db.collection("entries").countDocuments({ userId })

    const categoryPipeline = [
      { $match: { userId } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 as const } },
    ]
    const categories = await db.collection("entries").aggregate(categoryPipeline).toArray()

    const moodPipeline = [
      { $match: { userId } },
      { $group: { _id: "$mood", count: { $sum: 1 } } },
    ]
    const moods = await db.collection("entries").aggregate(moodPipeline).toArray()

    const yearPipeline = [
      { $match: { userId } },
      {
        $group: {
          _id: { $year: "$date" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 as const } },
    ]
    const years = await db.collection("entries").aggregate(yearPipeline).toArray()

    const recentEntries = await db
      .collection("entries")
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray()

    const firstEntry = await db
      .collection("entries")
      .find({ userId })
      .sort({ date: 1 })
      .limit(1)
      .toArray()

    const latestEntry = await db
      .collection("entries")
      .find({ userId })
      .sort({ date: -1 })
      .limit(1)
      .toArray()

    return NextResponse.json({
      totalEntries,
      categories: categories.map((c) => ({ name: c._id, count: c.count })),
      moods: moods.map((m) => ({ name: m._id, count: m.count })),
      years: years.map((y) => ({ year: y._id, count: y.count })),
      recentEntries: recentEntries.map((e) => ({
        _id: e._id.toString(),
        title: e.title,
        date: e.date,
        category: e.category,
        mood: e.mood,
      })),
      timespan: {
        first: firstEntry[0]?.date || null,
        latest: latestEntry[0]?.date || null,
      },
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
