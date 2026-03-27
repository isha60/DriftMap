"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { DashboardShell } from "@/components/dashboard-shell"
import { EntryForm } from "@/components/entry-form"
import { Loader2 } from "lucide-react"

function NewEntryContent() {
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
    <DashboardShell activeTab="new">
      <EntryForm />
    </DashboardShell>
  )
}

export default function NewEntryPage() {
  return (
    <AuthProvider>
      <NewEntryContent />
    </AuthProvider>
  )
}
