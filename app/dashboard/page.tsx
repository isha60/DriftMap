"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { DashboardShell } from "@/components/dashboard-shell"
import { StatsOverview } from "@/components/stats-overview"
import { Loader2 } from "lucide-react"

function DashboardContent() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) return null

  return (
    <DashboardShell activeTab="overview">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Welcome back, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here is a snapshot of your life journey.
        </p>
      </div>
      <StatsOverview />
    </DashboardShell>
  )
}

export default function DashboardPage() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  )
}
