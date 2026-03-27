import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ user: null })
  }

  const { db } = await connectToDatabase()
  const user = await db.collection("users").findOne({ _id: new ObjectId(session.userId) })

  if (!user) {
    return NextResponse.json({ user: null })
  }

  return NextResponse.json({
    user: {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  })
}
