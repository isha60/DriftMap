import Link from "next/link"
import {
  ArrowRight,
  MapPin,
  Clock,
  Layers,
  BarChart3,
  Shield,
  Sparkles,
} from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-16 text-center">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 mb-8">
        <MapPin className="h-6 w-6 text-primary" />
      </div>

      <h1 className="font-serif max-w-3xl text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl text-balance leading-[1.1]">
        Your Life Story,{" "}
        <span className="text-primary">Beautifully Mapped</span>
      </h1>

      <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
        Document milestones, memories, and turning points across every chapter
        of your journey. Driftmap turns your life into an interactive, visual
        timeline you will love revisiting.
      </p>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <Link
          href="/signup"
          className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90 hover:shadow-xl hover:shadow-primary/25"
        >
          Start Your Timeline
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/login"
          className="inline-flex h-12 items-center rounded-xl border border-border bg-card px-8 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          Sign In
        </Link>
      </div>

      <div className="mt-16 flex items-center gap-8 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Shield className="h-3.5 w-3.5" />
          <span>Private by default</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Free to start</span>
        </div>
      </div>
    </section>
  )
}

export function FeaturesSection() {
  const features = [
    {
      icon: Clock,
      title: "Interactive Timeline",
      description:
        "See your life events on a beautiful vertical timeline. Filter by year, category, or mood to rediscover moments that matter.",
    },
    {
      icon: Layers,
      title: "Categorize Everything",
      description:
        "Organize entries across Career, Travel, Personal, Education, Health, Creative, Relationships, and Finance.",
    },
    {
      icon: BarChart3,
      title: "Life Statistics",
      description:
        "Gain insights into your journey with charts showing entry patterns, category distribution, and mood trends.",
    },
  ]

  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Features
          </p>
          <h2 className="font-serif mt-3 text-3xl font-bold text-foreground md:text-4xl text-balance">
            Everything You Need to Capture Life
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Driftmap is thoughtfully designed to make documenting your journey
            effortless and meaningful.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Create an Account",
      description: "Sign up in seconds. Your timeline is private and secure from day one.",
    },
    {
      step: "02",
      title: "Add Life Events",
      description:
        "Log milestones, memories, and moments. Categorize them, tag your mood, and add details.",
    },
    {
      step: "03",
      title: "Explore Your Journey",
      description:
        "Browse your timeline, filter by category or year, and watch your life story unfold visually.",
    },
  ]

  return (
    <section id="how-it-works" className="border-t border-border bg-card px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            How It Works
          </p>
          <h2 className="font-serif mt-3 text-3xl font-bold text-foreground md:text-4xl text-balance">
            Three Steps to Your Story
          </h2>
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.step} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <span className="font-serif text-xl font-bold text-primary">{s.step}</span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CTASection() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl text-balance">
          Start Mapping Your Life Today
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Every day is a new point on your map. Begin capturing the moments that
          define you.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:opacity-90"
        >
          Create Free Account
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
