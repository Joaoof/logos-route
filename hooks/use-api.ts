// ======================================================================
// LogosRoute — Hook generico para chamadas API com loading/error
// Encapsula qualquer funcao async da camada de servico (lib/api.ts).
// ======================================================================

"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { ApiError } from "@/lib/api-config"

export interface UseApiReturn<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  execute: (...args: unknown[]) => Promise<T | null>
  setData: (data: T | null) => void
  reset: () => void
}

/**
 * Hook generico que wrapa uma funcao async da service layer.
 *
 * @example
 * const corridasApi = useApi(api.getCorridas)
 * // carregar:
 * await corridasApi.execute()
 * // dados:
 * corridasApi.data // CorridaDto[]
 */
export function useApi<T>(
  fn: (...args: unknown[]) => Promise<T>
): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const execute = useCallback(
    async (...args: unknown[]): Promise<T | null> => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await fn(...args)
        if (mountedRef.current) {
          setData(result)
        }
        return result
      } catch (err) {
        const msg =
          err instanceof ApiError
            ? err.detail || err.message
            : err instanceof Error
            ? err.message
            : "Erro inesperado"
        if (mountedRef.current) {
          setError(msg)
        }
        return null
      } finally {
        if (mountedRef.current) {
          setIsLoading(false)
        }
      }
    },
    [fn]
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setIsLoading(false)
  }, [])

  return { data, isLoading, error, execute, setData, reset }
}
