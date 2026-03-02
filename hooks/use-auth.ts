// ======================================================================
// LogosRoute — Hook de Autenticacao
// Gerencia login, cadastro e logout com JWT.
// ======================================================================

"use client"

import { useState, useCallback, useEffect } from "react"
import { getToken, setToken, removeToken } from "@/lib/api-config"
import * as api from "@/lib/api"
import type {
  LoginRequest,
  CadastroRequest,
  MotoristaDto,
} from "@/lib/types"

function mockMotorista(
  nome: string,
  email: string,
  cidade: string,
  appUtilizado: string
): MotoristaDto {
  return {
    id: 1,
    nome,
    email,
    cidade,
    appUtilizado,
    criadoEm: new Date().toISOString(),
  }
}

export interface UseAuthReturn {
  motorista: MotoristaDto | null
  isLoading: boolean
  isBootstrapping: boolean
  error: string | null
  isAuthenticated: boolean
  login: (body: LoginRequest) => Promise<void>
  cadastro: (body: CadastroRequest) => Promise<void>
  logout: () => void
  loginMock: (nome: string, cidade: string, appUtilizado: string) => void
}

export function useAuth(): UseAuthReturn {
  const [motorista, setMotorista] = useState<MotoristaDto | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isBootstrapping, setIsBootstrapping] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isAuthenticated = motorista !== null

  useEffect(() => {
    let alive = true

    async function bootstrapAuth() {
      const token = getToken()
      if (!token) {
        if (alive) setIsBootstrapping(false)
        return
      }

      try {
        const me = await api.getMotorista()
        if (alive) {
          setMotorista(me)
          setError(null)
        }
      } catch {
        removeToken()
        if (alive) {
          setMotorista(null)
          setError("Sua sessão expirou. Faça login novamente.")
        }
      } finally {
        if (alive) setIsBootstrapping(false)
      }
    }

    bootstrapAuth()

    return () => {
      alive = false
    }
  }, [])

  const doLogin = useCallback(async (body: LoginRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await api.login(body)
      setToken(res.token)
      setMotorista(res.motorista)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const doCadastro = useCallback(async (body: CadastroRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await api.cadastro(body)
      setToken(res.token)
      setMotorista(res.motorista)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar")
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    removeToken()
    setMotorista(null)
    setError(null)
  }, [])

  const loginMock = useCallback(
    (nome: string, cidade: string, appUtilizado: string) => {
      const emailSeguro = `${nome.trim().toLowerCase().replace(/\s+/g, ".")}@mock.dev`
      setMotorista(mockMotorista(nome.trim(), emailSeguro, cidade.trim(), appUtilizado.trim()))
      setError(null)
    },
    []
  )

  return {
    motorista,
    isLoading,
    isBootstrapping,
    error,
    isAuthenticated,
    login: doLogin,
    cadastro: doCadastro,
    logout,
    loginMock,
  }
}
