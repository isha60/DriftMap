"use client"

import { AuthProvider } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import {
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  CTASection,
} from "@/components/landing-sections"

export default function HomePage() {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main>
          <HeroSection />
          <FeaturesSection />
          <HowItWorksSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}
