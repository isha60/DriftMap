export const CATEGORIES = [
  { value: "career", label: "Career", color: "bg-amber-500" },
  { value: "personal", label: "Personal", color: "bg-rose-500" },
  { value: "travel", label: "Travel", color: "bg-sky-500" },
  { value: "education", label: "Education", color: "bg-emerald-500" },
  { value: "health", label: "Health", color: "bg-teal-500" },
  { value: "creative", label: "Creative", color: "bg-orange-500" },
  { value: "relationship", label: "Relationship", color: "bg-pink-500" },
  { value: "financial", label: "Financial", color: "bg-lime-600" },
] as const

export const MOODS = [
  { value: "ecstatic", label: "Ecstatic", icon: "Sparkles" },
  { value: "happy", label: "Happy", icon: "Sun" },
  { value: "neutral", label: "Neutral", icon: "Minus" },
  { value: "reflective", label: "Reflective", icon: "CloudSun" },
  { value: "sad", label: "Sad", icon: "Cloud" },
] as const

export function getCategoryColor(category: string): string {
  return CATEGORIES.find((c) => c.value === category)?.color || "bg-muted"
}

export function getCategoryLabel(category: string): string {
  return CATEGORIES.find((c) => c.value === category)?.label || category
}

export function getMoodLabel(mood: string): string {
  return MOODS.find((m) => m.value === mood)?.label || mood
}
