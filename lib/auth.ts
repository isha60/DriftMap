import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { connectToDatabase } from "./mongodb"
import { ObjectId } from "mongodb"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-change-me")

export interface UserPayload {
  userId: string
  email: string
  name: string
}

export async function createToken(payload: UserPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as UserPayload
  } catch {
    return null
  }
}

export async function getSession(): Promise<UserPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("driftmap_token")?.value
  if (!token) return null
  return verifyToken(token)
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session) return null

  const { db } = await connectToDatabase()
  const user = await db.collection("users").findOne({ _id: new ObjectId(session.userId) })
  if (!user) return null

  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  }
}
