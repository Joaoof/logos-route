"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ScreenAuth } from "@/components/screen-login"
import { useAuth } from "@/hooks/use-auth"

const USE_API = process.env.NEXT_PUBLIC_USE_API === "true"

export default function CadastroPage() {
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (auth.isAuthenticated) router.push("/")
  }, [auth.isAuthenticated, router])

  const handleCadastro = async (data: any) => {
    if (USE_API) {
      await auth.cadastro(data)
    } else {
      auth.loginMock(data.nome, data.cidade, data.appUtilizado)
    }
    router.push("/")
  }

  return (
    <ScreenAuth
      type="cadastro"
      usarApi={USE_API}
      onSubmit={handleCadastro}
      isLoading={auth.isLoading}
      error={auth.error}
    />
  )
}