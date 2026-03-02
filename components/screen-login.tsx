"use client"

import { useState } from "react"
import Link from "next/link"
import { z } from "zod"
import { User, Mail, Lock, Loader2, CheckCircle2 } from "lucide-react"
import type { CadastroRequest, LoginRequest } from "@/lib/types"

type ScreenAuthProps =
  | {
      type: "login"
      onSubmit: (data: LoginRequest) => Promise<void>
      isLoading?: boolean
      error?: string | null
      usarApi?: boolean
    }
  | {
      type: "cadastro"
      onSubmit: (data: CadastroRequest) => Promise<void>
      isLoading?: boolean
      error?: string | null
      usarApi?: boolean
    }

const loginSchema = z.object({
  email: z.string().trim().email("Informe um e-mail válido").max(120),
  senha: z.string().min(6, "A senha precisa ter no mínimo 6 caracteres").max(128),
})

const cadastroSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome").max(120),
  email: z.string().trim().email("Informe um e-mail válido").max(120),
  senha: z.string().min(6, "A senha precisa ter no mínimo 6 caracteres").max(128),
  cidade: z.string().trim().min(2, "Informe sua cidade").max(80),
  appUtilizado: z.string().trim().min(2, "Informe o app utilizado").max(80),
})

export function ScreenAuth({
  type,
  onSubmit,
  isLoading = false,
  error = null,
  usarApi = false,
}: ScreenAuthProps) {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [cidade, setCidade] = useState("")
  const [appUtilizado, setAppUtilizado] = useState("")
  const [clientError, setClientError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setClientError(null)

    if (type === "login") {
      const parsed = loginSchema.safeParse({ email, senha })
      if (!parsed.success) {
        setClientError(parsed.error.issues[0]?.message || "Dados inválidos")
        return
      }

      await onSubmit(parsed.data)
      return
    }

    if (usarApi && senha !== confirmarSenha) {
      setClientError("As senhas não conferem.")
      return
    }

    const parsed = cadastroSchema.safeParse({
      nome,
      email,
      senha,
      cidade,
      appUtilizado,
    })

    if (!parsed.success) {
      setClientError(parsed.error.issues[0]?.message || "Dados inválidos")
      return
    }

    await onSubmit(parsed.data)
  }

  const THEME = {
    cyan: "#1ce4d2",
    stripes:
      "repeating-linear-gradient(45deg, #e4fbfb, #e4fbfb 25px, #ffffff 25px, #ffffff 50px)",
  }

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: THEME.stripes }}
    >
      <div
        className="absolute -bottom-[20%] -right-[10%] w-[120%] md:w-[80%] aspect-square rounded-tl-[40%] z-0"
        style={{ backgroundColor: THEME.cyan }}
      />

      {usarApi && (
        <div className="relative z-20 mb-12 flex gap-4">
          <Link
            href="/login"
            prefetch
            className={`px-6 py-2 rounded-full font-bold transition-all ${
              type === "login"
                ? "bg-[#1ce4d2] text-white shadow-lg"
                : "bg-white text-[#1ce4d2] shadow"
            }`}
          >
            LOGIN
          </Link>
          <Link
            href="/cadastro"
            prefetch
            className={`px-6 py-2 rounded-full font-bold transition-all ${
              type === "cadastro"
                ? "bg-[#1ce4d2] text-white shadow-lg"
                : "bg-white text-[#1ce4d2] shadow"
            }`}
          >
            CADASTRO
          </Link>
        </div>
      )}

      <div
        className="relative z-10 w-full max-w-[340px] rounded-[32px] p-6 pt-14 pb-8 shadow-2xl"
        style={{
          backgroundColor: THEME.cyan,
          boxShadow: "0 25px 50px -12px rgba(28, 228, 210, 0.4)",
        }}
      >
        <div className="absolute -top-[50px] left-1/2 -translate-x-1/2 drop-shadow-md">
          <div className="size-[100px] bg-white rounded-full flex items-center justify-center shadow-inner border-4 border-[#1ce4d2]">
            <img src="logos.png" alt="Logo LogosRoute" />
          </div>
        </div>

        <h2 className="text-center text-white font-extrabold tracking-widest text-lg uppercase mb-8 mt-2">
          {type === "cadastro" ? "Crie sua Conta" : "Acesse sua Conta"}
        </h2>

        {(error || clientError) && (
          <div
            className="mb-4 bg-white/20 text-white text-sm font-bold text-center p-2 rounded-xl"
            role="alert"
            aria-live="polite"
          >
            {clientError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
          {(!usarApi || type === "cadastro") && (
            <div className="flex items-center bg-white rounded-full px-4 h-12 shadow-sm">
              <label htmlFor="nome" className="sr-only">
                Nome
              </label>
              <User className="size-5 text-[#1ce4d2]" />
              <input
                id="nome"
                type="text"
                placeholder="NOME"
                autoComplete="name"
                maxLength={120}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="w-full bg-transparent outline-none text-[#1ce4d2] font-bold text-xs tracking-wider ml-3 placeholder:text-[#1ce4d2]/60"
              />
            </div>
          )}

          {usarApi && (
            <div className="flex items-center bg-white rounded-full px-4 h-12 shadow-sm">
              <label htmlFor="email" className="sr-only">
                E-mail
              </label>
              <Mail className="size-5 text-[#1ce4d2]" />
              <input
                id="email"
                type="email"
                placeholder="E-MAIL"
                autoComplete="email"
                maxLength={120}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent outline-none text-[#1ce4d2] font-bold text-xs tracking-wider ml-3 placeholder:text-[#1ce4d2]/60"
              />
            </div>
          )}

          {usarApi && (
            <div className="flex items-center bg-white rounded-full px-4 h-12 shadow-sm">
              <label htmlFor="senha" className="sr-only">
                Senha
              </label>
              <Lock className="size-5 text-[#1ce4d2]" />
              <input
                id="senha"
                type="password"
                placeholder="SENHA"
                autoComplete={type === "cadastro" ? "new-password" : "current-password"}
                maxLength={128}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="w-full bg-transparent outline-none text-[#1ce4d2] font-bold text-xs tracking-wider ml-3 placeholder:text-[#1ce4d2]/60"
              />
            </div>
          )}

          {usarApi && type === "cadastro" && (
            <div className="flex items-center bg-white rounded-full px-4 h-12 shadow-sm">
              <label htmlFor="confirmarSenha" className="sr-only">
                Confirmar senha
              </label>
              <CheckCircle2 className="size-5 text-[#1ce4d2]" />
              <input
                id="confirmarSenha"
                type="password"
                placeholder="CONFIRMAR SENHA"
                autoComplete="new-password"
                maxLength={128}
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
                className="w-full bg-transparent outline-none text-[#1ce4d2] font-bold text-xs tracking-wider ml-3 placeholder:text-[#1ce4d2]/60"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-4 mx-auto bg-white text-[#1ce4d2] font-extrabold tracking-widest text-[11px] px-8 py-3 rounded-full shadow-md hover:scale-105 active:scale-95 transition-transform flex items-center justify-center min-w-[120px]"
            aria-label={type === "cadastro" ? "Enviar cadastro" : "Enviar login"}
          >
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : "SUBMIT"}
          </button>
        </form>
      </div>
    </div>
  )
}
