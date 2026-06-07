"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, X, Plus } from "lucide-react"
import { CATEGORIES, MOODS } from "@/lib/constants"
import { toast } from "sonner"

export function EntryForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [category, setCategory] = useState("")
  const [mood, setMood] = useState("neutral")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase()
    if (trimmed && !tags.includes(trimmed) && tags.length < 8) {
      setTags([...tags, trimmed])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !date || !category) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, date, category, mood, tags }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      toast.success("Entry added to your timeline!")
      router.push("/dashboard/timeline")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create entry")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <h2 className="font-serif text-xl font-bold text-foreground">New Timeline Entry</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Capture a moment, milestone, or memory.
        </p>

        <div className="mt-8 flex flex-col gap-5">
          {/* Title */}
          <div>
            <label htmlFor="title" className="text-xs font-medium text-foreground">
              Title <span className="text-destructive">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={120}
              className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="What happened?"
            />
          </div>

          {/* Date + Category */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="date" className="text-xs font-medium text-foreground">
                Date <span className="text-destructive">*</span>
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label htmlFor="category" className="text-xs font-medium text-foreground">
                Category <span className="text-destructive">*</span>
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="mt-1.5 h-11 w-full appearance-none rounded-lg border border-input bg-background px-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="" disabled>Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mood */}
          <div>
            <label className="text-xs font-medium text-foreground">Mood</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMood(m.value)}
                  className={`rounded-lg border px-4 py-2 text-xs font-medium transition-all ${
                    mood === m.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="text-xs font-medium text-foreground">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              placeholder="Write about this moment... (optional)"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-medium text-foreground">Tags</label>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                  maxLength={24}
                  className="h-8 w-28 rounded-md border border-input bg-background px-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  placeholder="Add tag..."
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:border-primary/30 hover:text-primary"
                  aria-label="Add tag"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="h-10 rounded-lg border border-border bg-card px-6 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Entry"}
          </button>
        </div>
      </div>
    </form>
  )
}
