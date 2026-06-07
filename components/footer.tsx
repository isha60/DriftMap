import Link from "next/link"
import { MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <MapPin className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium text-foreground">Driftmap</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="#features" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
            Features
          </Link>
          <Link href="#how-it-works" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
            How It Works
          </Link>
          <Link href="/login" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
            Sign In
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">
          Made with care. Your memories, beautifully mapped.
        </p>
      </div>
    </footer>
  )
}
