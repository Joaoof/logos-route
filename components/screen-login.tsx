"use client"

import { useState } from "react"
import Link from "next/link"
import { User, Mail, Lock, Smartphone, MapPin, X, Loader2, CheckCircle2 } from "lucide-react"
import type { LoginRequest, CadastroRequest } from "@/lib/types"

interface ScreenAuthProps {
  type: "login" | "cadastro"
  onSubmit: (data: any) => Promise<void>
  isLoading?: boolean
  error?: string | null
  usarApi?: boolean
}

export function ScreenAuth({ type, onSubmit, isLoading = false, error = null, usarApi = false }: ScreenAuthProps) {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [cidade, setCidade] = useState("")
  const [appUtilizado, setAppUtilizado] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (type === "cadastro" && usarApi && senha !== confirmarSenha) {
      alert("As senhas não conferem.")
      return
    }

    const payload = type === "login" 
      ? { email, senha }
      : { nome, email, senha, cidade, appUtilizado }

    await onSubmit(payload)
  }

  const THEME = {
    cyan: "#1ce4d2",
    white: "#ffffff",
    stripes: "repeating-linear-gradient(45deg, #e4fbfb, #e4fbfb 25px, #ffffff 25px, #ffffff 50px)"
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap');
        .font-outfit { font-family: 'Outfit', sans-serif; }
      `}} />

      <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden font-outfit" style={{ background: THEME.stripes }}>
        <div className="absolute -bottom-[20%] -right-[10%] w-[120%] md:w-[80%] aspect-square rounded-tl-[40%] z-0" style={{ backgroundColor: THEME.cyan }} />

        {/* Navegação Real baseada em Rotas */}
        {usarApi && (
          <div className="relative z-20 mb-12 flex gap-4">
            <Link href="/login" prefetch className={`px-6 py-2 rounded-full font-bold transition-all ${type === "login" ? "bg-[#1ce4d2] text-white shadow-lg" : "bg-white text-[#1ce4d2] shadow"}`}>
              LOGIN
            </Link>
            <Link href="/cadastro" prefetch className={`px-6 py-2 rounded-full font-bold transition-all ${type === "cadastro" ? "bg-[#1ce4d2] text-white shadow-lg" : "bg-white text-[#1ce4d2] shadow"}`}>
              CADASTRO
            </Link>
          </div>
        )}

        <div className="relative z-10 w-full max-w-[340px] rounded-[32px] p-6 pt-14 pb-8 shadow-2xl" style={{ backgroundColor: THEME.cyan, boxShadow: "0 25px 50px -12px rgba(28, 228, 210, 0.4)" }}>
          <div className="absolute -top-[50px] left-1/2 -translate-x-1/2 drop-shadow-md">
             {/* SVGs omitidos para brevidade - MANTENHA O SEU SVG DO HEXAGONO AQUI */}
             <div className="size-[100px] bg-white rounded-full flex items-center justify-center shadow-inner border-4 border-[#1ce4d2]">
                  <img src="logos.png" alt="" />
             </div>
          </div>

          <h2 className="text-center text-white font-extrabold tracking-widest text-lg uppercase mb-8 mt-2">
            {type === "cadastro" ? "Crie sua Conta" : "Acesse sua Conta"}
          </h2>

          {error && <div className="mb-4 bg-white/20 text-white text-sm font-bold text-center p-2 rounded-xl">{error}</div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Campos condicionados pela prop 'type' em vez de estado interno */}
            {(!usarApi || type === "cadastro") && (
              <div className="flex items-center bg-white rounded-full px-4 h-12 shadow-sm">
                <User className="size-5 text-[#1ce4d2]" />
                <input type="text" placeholder="NOME" value={nome} onChange={(e) => setNome(e.target.value)} required className="w-full bg-transparent outline-none text-[#1ce4d2] font-bold text-xs tracking-wider ml-3 placeholder:text-[#1ce4d2]/60" />
              </div>
            )}

            {usarApi && (
              <div className="flex items-center bg-white rounded-full px-4 h-12 shadow-sm">
                <Mail className="size-5 text-[#1ce4d2]" />
                <input type="email" placeholder="E-MAIL" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-transparent outline-none text-[#1ce4d2] font-bold text-xs tracking-wider ml-3 placeholder:text-[#1ce4d2]/60" />
              </div>
            )}

            {usarApi && (
              <div className="flex items-center bg-white rounded-full px-4 h-12 shadow-sm">
                <Lock className="size-5 text-[#1ce4d2]" />
                <input type="password" placeholder="SENHA" value={senha} onChange={(e) => setSenha(e.target.value)} required className="w-full bg-transparent outline-none text-[#1ce4d2] font-bold text-xs tracking-wider ml-3 placeholder:text-[#1ce4d2]/60" />
              </div>
            )}

            {usarApi && type === "cadastro" && (
              <div className="flex items-center bg-white rounded-full px-4 h-12 shadow-sm">
                <CheckCircle2 className="size-5 text-[#1ce4d2]" />
                <input type="password" placeholder="CONFIRMAR SENHA" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} required className="w-full bg-transparent outline-none text-[#1ce4d2] font-bold text-xs tracking-wider ml-3 placeholder:text-[#1ce4d2]/60" />
              </div>
            )}

            <button type="submit" disabled={isLoading} className="mt-4 mx-auto bg-white text-[#1ce4d2] font-extrabold tracking-widest text-[11px] px-8 py-3 rounded-full shadow-md hover:scale-105 active:scale-95 transition-transform flex items-center justify-center min-w-[120px]">
              {isLoading ? <Loader2 className="size-4 animate-spin" /> : "SUBMIT"}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}