"use client"

import useSWR from "swr"
import { format } from "date-fns"
import {
  BookOpen,
  Calendar,
  TrendingUp,
  Layers,
  Clock,
} from "lucide-react"
import { getCategoryLabel, getCategoryColor } from "@/lib/constants"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function StatsOverview() {
  const { data, isLoading } = useSWR("/api/stats", fetcher)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-card border border-border" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-card border border-border" />
          ))}
        </div>
      </div>
    )
  }

  if (!data || data.error) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/40" />
        <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">
          Your journey begins here
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Create your first timeline entry to see stats and insights.
        </p>
        <Link
          href="/dashboard/new"
          className="mt-6 inline-flex h-10 items-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Add First Entry
        </Link>
      </div>
    )
  }

  const { totalEntries, categories, moods, years, recentEntries, timespan } = data

  return (
    <div className="flex flex-col gap-6">
      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{totalEntries}</p>
            <p className="text-xs text-muted-foreground">Total Entries</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{categories?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Categories Used</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{years?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Years Documented</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Category Breakdown */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Category Breakdown</h3>
          </div>
          {categories && categories.length > 0 ? (
            <div className="flex flex-col gap-3">
              {categories.map((cat: { name: string; count: number }) => {
                const pct = totalEntries > 0 ? (cat.count / totalEntries) * 100 : 0
                return (
                  <div key={cat.name} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground">
                        {getCategoryLabel(cat.name)}
                      </span>
                      <span className="text-xs text-muted-foreground">{cat.count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-secondary">
                      <div
                        className={`h-full rounded-full ${getCategoryColor(cat.name)} transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No categories yet.</p>
          )}
        </div>

        {/* Recent Entries */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Clock className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Recent Entries</h3>
          </div>
          {recentEntries && recentEntries.length > 0 ? (
            <div className="flex flex-col gap-3">
              {recentEntries.map((entry: { _id: string; title: string; date: string; category: string }) => (
                <div
                  key={entry._id}
                  className="flex items-center gap-3 rounded-xl bg-secondary/50 p-3"
                >
                  <div className={`h-2 w-2 rounded-full ${getCategoryColor(entry.category)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{entry.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(entry.date), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No entries yet.</p>
          )}
        </div>
      </div>

      {/* Timespan */}
      {timespan?.first && timespan?.latest && (
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Your timeline spans</p>
          <p className="mt-2 font-serif text-lg font-semibold text-foreground">
            {format(new Date(timespan.first), "MMM yyyy")} — {format(new Date(timespan.latest), "MMM yyyy")}
          </p>
        </div>
      )}
    </div>
  )
}
