import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid entry ID" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const result = await db.collection("entries").deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(session.userId),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete entry error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid entry ID" }, { status: 400 })
    }

    const updates = await req.json()

    const allowedFields = ["title", "description", "date", "category", "mood", "tags"]
    const sanitized: Record<string, unknown> = {}
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        sanitized[key] = key === "date" ? new Date(updates[key]) : updates[key]
      }
    }

    const { db } = await connectToDatabase()

    const result = await db.collection("entries").updateOne(
      { _id: new ObjectId(id), userId: new ObjectId(session.userId) },
      { $set: sanitized }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update entry error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
