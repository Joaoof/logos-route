// ======================================================================
// LogosRoute — Configuracao central da camada HTTP
// Altere API_BASE_URL ao apontar para o backend C# .NET real.
// ======================================================================

import type { ProblemDetails } from "./types"

/**
 * URL base da API C# .NET.
 * Em dev, use http://localhost:5000/api (ou a porta do launchSettings).
 * Em prod, troque por https://api.logosroute.com.br/api.
 *
 * Variavel de ambiente: NEXT_PUBLIC_API_URL
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

/**
 * Quando true, o front usa dados mock locais e nunca chama a API real.
 * Basta setar NEXT_PUBLIC_USE_MOCK=true no .env.local para ativar.
 */
export const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK === "true" ||
  typeof window !== "undefined"
    ? !process.env.NEXT_PUBLIC_API_URL
    : true

// ======================== TOKEN ========================

const TOKEN_KEY = "logosroute_jwt"

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

// ======================== FETCH WRAPPER ========================

export class ApiError extends Error {
  status: number
  detail?: string
  errors?: Record<string, string[]>

  constructor(problem: ProblemDetails) {
    super(problem.title)
    this.name = "ApiError"
    this.status = problem.status
    this.detail = problem.detail
    this.errors = problem.errors
  }
}

/**
 * Wrapper generico para fetch. Injeta JWT no header Authorization,
 * trata ProblemDetails, e retorna o body tipado.
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  // Sem conteudo (204 No Content)
  if (res.status === 204) {
    return undefined as T
  }

  const body = await res.json()

  if (!res.ok) {
    // Backend retorna ProblemDetails para erros
    throw new ApiError(body as ProblemDetails)
  }

  return body as T
}
