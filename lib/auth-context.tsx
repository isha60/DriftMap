"use client"

import { createContext, useContext, useCallback, type ReactNode } from "react"
import useSWR from "swr"

interface User {
  _id: string
  name: string
  email: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  mutate: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const fetcher = (url: string) => fetch(url, { credentials: "include" }).then((r) => r.json())

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, mutate } = useSWR("/api/auth/me", fetcher, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
  })

  const user = data?.user || null

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      await mutate()
    },
    [mutate]
  )

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      await mutate()
    },
    [mutate]
  )

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/"
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, mutate }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
