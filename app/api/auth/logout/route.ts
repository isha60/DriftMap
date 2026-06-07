import { NextResponse } from "next/server"

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.set("driftmap_token", "", {
    httpOnly: true,
    secure: false, // Must match login route to successfully delete over HTTP on EC2
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  })
  return response
}
