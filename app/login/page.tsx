"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ScreenAuth } from "@/components/screen-login"
import { useAuth } from "@/hooks/use-auth"
import type { LoginRequest } from "@/lib/types"

const USE_API = process.env.NEXT_PUBLIC_USE_API === "true"

export default function LoginPage() {
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (auth.isAuthenticated) router.push("/")
  }, [auth.isAuthenticated, router])

  const handleLogin = async (data: LoginRequest) => {
    await auth.login(data)
    router.push("/")
  }

  return (
    <ScreenAuth
      type="login"
      usarApi={USE_API}
      onSubmit={handleLogin}
      isLoading={auth.isLoading}
      error={auth.error}
    />
  )
}
