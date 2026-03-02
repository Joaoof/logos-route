// ======================================================================
// LogosRoute — Configuracao central da camada HTTP
// Altere API_BASE_URL ao apontar para o backend C# .NET real.
// ======================================================================

import type { ProblemDetails } from "./types"

const REQUEST_TIMEOUT_MS = 12000
const TOKEN_KEY = "logosroute_jwt"

function resolveApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

  try {
    const url = new URL(raw)
    const isLocalhost = ["localhost", "127.0.0.1"].includes(url.hostname)
    const isHttps = url.protocol === "https:"

    if (process.env.NODE_ENV === "production" && !isHttps && !isLocalhost) {
      throw new Error("NEXT_PUBLIC_API_URL deve usar HTTPS em produção")
    }

    return url.toString().replace(/\/$/, "")
  } catch {
    throw new Error(`NEXT_PUBLIC_API_URL inválida: ${raw}`)
  }
}

/**
 * URL base da API C# .NET.
 * Em dev, use http://localhost:5000/api (ou a porta do launchSettings).
 * Em prod, troque por https://api.logosroute.com.br/api.
 */
export const API_BASE_URL = resolveApiBaseUrl()

/**
 * Quando true, o front usa dados mock locais e nunca chama a API real.
 * Prioridade:
 * 1) NEXT_PUBLIC_USE_MOCK=true|false
 * 2) fallback para ausência de NEXT_PUBLIC_API_URL
 */
export const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK === "true"
    ? true
    : process.env.NEXT_PUBLIC_USE_MOCK === "false"
    ? false
    : !process.env.NEXT_PUBLIC_API_URL

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null

  const pref = process.env.NEXT_PUBLIC_TOKEN_STORAGE
  if (pref === "session") return window.sessionStorage
  return window.localStorage
}

export function getToken(): string | null {
  return getStorage()?.getItem(TOKEN_KEY) ?? null
}

export function setToken(token: string): void {
  getStorage()?.setItem(TOKEN_KEY, token)
}

export function removeToken(): void {
  getStorage()?.removeItem(TOKEN_KEY)
}

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

function toApiError(status: number, body: unknown): ApiError {
  if (body && typeof body === "object" && "title" in body && "status" in body) {
    return new ApiError(body as ProblemDetails)
  }

  return new ApiError({
    title: status >= 500 ? "Erro interno do servidor" : "Falha na requisição",
    status,
    detail: typeof body === "string" ? body : undefined,
  })
}

async function parseResponseBody(res: Response): Promise<unknown> {
  const contentType = res.headers.get("content-type") || ""

  if (contentType.includes("application/json")) {
    return res.json()
  }

  return res.text()
}

/**
 * Wrapper generico para fetch. Injeta JWT no header Authorization,
 * aplica timeout e trata retorno de erro de forma segura.
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  }

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      cache: "no-store",
      credentials: "omit",
      referrerPolicy: "strict-origin-when-cross-origin",
      headers,
      signal: controller.signal,
    })

    if (res.status === 204) {
      return undefined as T
    }

    const body = await parseResponseBody(res)

    if (!res.ok) {
      throw toApiError(res.status, body)
    }

    return body as T
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError({
        title: "Tempo de requisição excedido",
        status: 408,
        detail: "A API demorou para responder. Tente novamente.",
      })
    }

    throw error
  } finally {
    clearTimeout(timeout)
  }
}
