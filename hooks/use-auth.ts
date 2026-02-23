// ======================================================================
// LogosRoute — Hook de Autenticacao
// Gerencia login, cadastro e logout com JWT.
// Quando USE_MOCK = true, simula auth sem rede.
// ======================================================================

"use client"

import { useState, useCallback } from "react"
import { getToken, setToken, removeToken } from "@/lib/api-config"
import * as api from "@/lib/api"
import type {
  LoginRequest,
  CadastroRequest,
  MotoristaDto,
} from "@/lib/types"

// Mock motorista retornado quando USE_MOCK = true
function mockMotorista(nome: string, email: string, cidade: string, appUtilizado: string): MotoristaDto {
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
  error: string | null
  isAuthenticated: boolean
  login: (body: LoginRequest) => Promise<void>
  cadastro: (body: CadastroRequest) => Promise<void>
  logout: () => void
  /** Bypass para modo mock — seta motorista sem chamar API */
  loginMock: (nome: string, cidade: string, appUtilizado: string) => void
}

export function useAuth(): UseAuthReturn {
  const [motorista, setMotorista] = useState<MotoristaDto | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isAuthenticated = motorista !== null

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
      setMotorista(mockMotorista(nome, `${nome.toLowerCase().replace(/\s/g, ".")}@mock.dev`, cidade, appUtilizado))
    },
    []
  )

  return {
    motorista,
    isLoading,
    error,
    isAuthenticated,
    login: doLogin,
    cadastro: doCadastro,
    logout,
    loginMock,
  }
}
