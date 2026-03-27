"use client"

import { useState } from "react"
import useSWR from "swr"
import { format } from "date-fns"
import { Filter, Trash2, Calendar, ChevronDown, BookOpen } from "lucide-react"
import { CATEGORIES, getCategoryColor, getCategoryLabel, getMoodLabel } from "@/lib/constants"
import { toast } from "sonner"
import Link from "next/link"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface TimelineEntry {
  _id: string
  title: string
  description: string
  date: string
  category: string
  mood: string
  tags: string[]
}

export function TimelineView() {
  const [category, setCategory] = useState("all")
  const [year, setYear] = useState("all")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const queryParams = new URLSearchParams()
  if (category !== "all") queryParams.set("category", category)
  if (year !== "all") queryParams.set("year", year)

  const { data, isLoading, mutate } = useSWR(
    `/api/entries?${queryParams.toString()}`,
    fetcher
  )

  const { data: statsData } = useSWR("/api/stats", fetcher)
  const availableYears = statsData?.years?.map((y: { year: number }) => y.year) || []

  const entries: TimelineEntry[] = data?.entries || []

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/entries/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      toast.success("Entry deleted")
      mutate()
    } catch {
      toast.error("Failed to delete entry")
    }
  }

  const groupedByYear: Record<string, TimelineEntry[]> = {}
  entries.forEach((entry) => {
    const y = new Date(entry.date).getFullYear().toString()
    if (!groupedByYear[y]) groupedByYear[y] = []
    groupedByYear[y].push(entry)
  })

  const sortedYears = Object.keys(groupedByYear).sort((a, b) => parseInt(b) - parseInt(a))

  return (
    <div className="flex flex-col gap-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Filter:</span>
        </div>

        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-9 appearance-none rounded-lg border border-border bg-card pr-8 pl-3 text-xs font-medium text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        </div>

        <div className="relative">
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="h-9 appearance-none rounded-lg border border-border bg-card pr-8 pl-3 text-xs font-medium text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Years</option>
            {availableYears.map((y: number) => (
              <option key={y} value={y.toString()}>{y}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        </div>

        <span className="text-xs text-muted-foreground">
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      {/* Timeline */}
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-card border border-border" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">
            No entries found
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {category !== "all" || year !== "all"
              ? "Try adjusting your filters."
              : "Create your first entry to start your timeline."}
          </p>
          <Link
            href="/dashboard/new"
            className="mt-6 inline-flex h-10 items-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground"
          >
            Create Entry
          </Link>
        </div>
      ) : (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border md:left-8" />

          {sortedYears.map((yr) => (
            <div key={yr} className="mb-8">
              {/* Year marker */}
              <div className="relative mb-4 flex items-center gap-3 pl-0">
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground md:h-16 md:w-16 md:text-sm">
                  {yr}
                </div>
              </div>

              {/* Entries for the year */}
              <div className="flex flex-col gap-3 pl-12 md:pl-20">
                {groupedByYear[yr].map((entry) => {
                  const isExpanded = expandedId === entry._id
                  return (
                    <div
                      key={entry._id}
                      className="group relative rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-md hover:shadow-primary/5"
                    >
                      {/* Connector dot */}
                      <div
                        className={`absolute -left-[29px] top-6 h-3 w-3 rounded-full border-2 border-background md:-left-[48px] ${getCategoryColor(entry.category)}`}
                      />

                      <div className="flex items-start justify-between gap-3">
                        <div
                          className="flex-1 cursor-pointer min-w-0"
                          onClick={() => setExpandedId(isExpanded ? null : entry._id)}
                          role="button"
                          tabIndex={0}
                          aria-expanded={isExpanded}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              setExpandedId(isExpanded ? null : entry._id)
                            }
                          }}
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex h-5 items-center rounded-full px-2 text-[10px] font-semibold text-primary-foreground ${getCategoryColor(entry.category)}`}
                            >
                              {getCategoryLabel(entry.category)}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(entry.date), "MMM d, yyyy")}
                            </span>
                          </div>
                          <h3 className="mt-2 text-base font-semibold text-foreground">
                            {entry.title}
                          </h3>
                          {!isExpanded && entry.description && (
                            <p className="mt-1 truncate text-sm text-muted-foreground">
                              {entry.description}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => handleDelete(entry._id)}
                          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-muted-foreground/0 transition-all group-hover:text-muted-foreground hover:!bg-destructive/10 hover:!text-destructive"
                          aria-label={`Delete ${entry.title}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 border-t border-border pt-4">
                          {entry.description && (
                            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                              {entry.description}
                            </p>
                          )}
                          <div className="mt-3 flex flex-wrap items-center gap-3">
                            <span className="text-xs text-muted-foreground">
                              Mood: {getMoodLabel(entry.mood)}
                            </span>
                            {entry.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {entry.tags.map((tag: string) => (
                                  <span
                                    key={tag}
                                    className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
