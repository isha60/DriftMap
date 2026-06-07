"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { MapPin, LogOut, LayoutDashboard, Clock, Plus } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface DashboardShellProps {
  children: React.ReactNode
  activeTab: "overview" | "timeline" | "new"
}

export function DashboardShell({ children, activeTab }: DashboardShellProps) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const navItems = [
    { key: "overview" as const, label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { key: "timeline" as const, label: "Timeline", icon: Clock, href: "/dashboard/timeline" },
    { key: "new" as const, label: "New Entry", icon: Plus, href: "/dashboard/new" },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <MapPin className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                Driftmap
              </span>
            </Link>

            <nav className="hidden items-center gap-1 md:flex" aria-label="Dashboard navigation">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    activeTab === item.key
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <span className="hidden text-sm text-muted-foreground md:block">
                {user.name}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto border-t border-border px-6 py-2 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs transition-colors ${
                activeTab === item.key
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </Link>
          ))}
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        {children}
      </main>
    </div>
  )
}
