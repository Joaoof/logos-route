"use client"

import { useState } from "react"
import { 
  User, 
  Mail, 
  Lock, 
  Smartphone, 
  MapPin, 
  X,
  Loader2,
  CheckCircle2
} from "lucide-react"
import type { LoginRequest, CadastroRequest } from "@/lib/types"

type Tab = "login" | "cadastro"

interface ScreenLoginProps {
  onLogin?: (body: LoginRequest) => Promise<void>
  onCadastro?: (body: CadastroRequest) => Promise<void>
  onCadastroMock?: (nome: string, cidade: string, appUtilizado: string) => void
  isLoading?: boolean
  error?: string | null
  usarApi?: boolean
}

export function ScreenLogin({
  onLogin,
  onCadastro,
  onCadastroMock,
  isLoading = false,
  error = null,
  usarApi = false,
}: ScreenLoginProps) {
  const [tab, setTab] = useState<Tab>("cadastro")

  // Form state
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")
  const [cidade, setCidade] = useState("")
  const [appUtilizado, setAppUtilizado] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (usarApi) {
      if (tab === "login" && onLogin) {
        await onLogin({ email, senha })
      } else if (tab === "cadastro" && onCadastro) {
        if (senha !== confirmarSenha) {
          alert("As senhas não conferem.")
          return
        }
        await onCadastro({ nome, email, senha, cidade, appUtilizado })
      }
    } else {
      if (!nome.trim()) return
      onCadastroMock?.(nome, cidade, appUtilizado)
    }
  }

  // Cores baseadas na imagem
  const THEME = {
    cyan: "#1ce4d2",
    cyanDark: "#15b8a9",
    white: "#ffffff",
    stripes: "repeating-linear-gradient(45deg, #e4fbfb, #e4fbfb 25px, #ffffff 25px, #ffffff 50px)"
  }

  return (
    <>
      {/* Importando a fonte geométrica não-genérica apenas para escopo deste componente */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap');
        .font-outfit { font-family: 'Outfit', sans-serif; }
      `}} />

      <div 
        className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden font-outfit"
        style={{ background: THEME.stripes }}
      >
        {/* Onda de Fundo (Canto inferior direito) */}
        <div 
          className="absolute -bottom-[20%] -right-[10%] w-[120%] md:w-[80%] aspect-square rounded-tl-[40%] z-0"
          style={{ backgroundColor: THEME.cyan }}
        />

        {/* Toggles de Aba (Fora do card para manter a estética limpa) */}
        {usarApi && (
          <div className="relative z-20 mb-12 flex gap-4">
             <button
              onClick={() => setTab("login")}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                tab === "login" ? "bg-[#1ce4d2] text-white shadow-lg" : "bg-white text-[#1ce4d2] shadow"
              }`}
            >
              LOGIN
            </button>
            <button
              onClick={() => setTab("cadastro")}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                tab === "cadastro" ? "bg-[#1ce4d2] text-white shadow-lg" : "bg-white text-[#1ce4d2] shadow"
              }`}
            >
              CADASTRO
            </button>
          </div>
        )}

        {/* Card Principal */}
        <div 
          className="relative z-10 w-full max-w-[340px] rounded-[32px] p-6 pt-14 pb-8 shadow-2xl transition-all duration-300"
          style={{ backgroundColor: THEME.cyan, boxShadow: "0 25px 50px -12px rgba(28, 228, 210, 0.4)" }}
        >
          {/* Botão Fechar (Estético) */}
          <button className="absolute top-4 right-4 text-white hover:scale-110 transition-transform">
            <X className="size-6 stroke-[3]" />
          </button>

          {/* Avatar Hexagonal Flutuante */}
          <div className="absolute -top-[50px] left-1/2 -translate-x-1/2 drop-shadow-md">
            <svg width="100" height="110" viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Outer Hexagon (Shadow/Border) */}
              <path d="M50 0L93.3013 25V75L50 100L6.69873 75V25L50 0Z" fill="white"/>
              {/* Inner Hexagon (Cyan) */}
              <path d="M50 4L89.8366 27V73L50 96L10.1634 73V27L50 4Z" fill={THEME.cyan}/>
              {/* Inner White Line */}
              <path d="M50 8L86.3718 29V71L50 92L13.6282 71V29L50 8Z" stroke="white" strokeWidth="2"/>
            </svg>
            <div className="absolute top-[35px] left-1/2 -translate-x-1/2 text-white">
              <User className="size-10 stroke-[2]" />
            </div>
          </div>

          <h2 className="text-center text-white font-extrabold tracking-widest text-lg uppercase mb-8 mt-2">
            {tab === "cadastro" ? "Crie sua Conta" : "Acesse sua Conta"}
          </h2>

          {error && (
            <div className="mb-4 bg-white/20 text-white text-sm font-bold text-center p-2 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            
            {/* NOME */}
            {(!usarApi || tab === "cadastro") && (
              <div className="flex items-center bg-white rounded-full px-4 h-12 shadow-sm">
                <User className="size-5 text-[#1ce4d2]" />
                <input
                  type="text"
                  placeholder="USERNAME / NOME"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  className="w-full bg-transparent border-none outline-none text-[#1ce4d2] font-bold text-xs tracking-wider ml-3 placeholder:text-[#1ce4d2]/60"
                />
              </div>
            )}

            {/* EMAIL */}
            {usarApi && (
              <div className="flex items-center bg-white rounded-full px-4 h-12 shadow-sm">
                <Mail className="size-5 text-[#1ce4d2]" />
                <input
                  type="email"
                  placeholder="E-MAIL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent border-none outline-none text-[#1ce4d2] font-bold text-xs tracking-wider ml-3 placeholder:text-[#1ce4d2]/60"
                />
              </div>
            )}

            {/* SENHA */}
            {usarApi && (
              <div className="flex items-center bg-white rounded-full px-4 h-12 shadow-sm">
                <Lock className="size-5 text-[#1ce4d2]" />
                <input
                  type="password"
                  placeholder="PASSWORD"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="w-full bg-transparent border-none outline-none text-[#1ce4d2] font-bold text-xs tracking-wider ml-3 placeholder:text-[#1ce4d2]/60"
                />
              </div>
            )}

            {/* CONFIRMAR SENHA */}
            {usarApi && tab === "cadastro" && (
              <div className="flex items-center bg-white rounded-full px-4 h-12 shadow-sm">
                <CheckCircle2 className="size-5 text-[#1ce4d2]" />
                <input
                  type="password"
                  placeholder="CONFIRM PASSWORD"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                  className="w-full bg-transparent border-none outline-none text-[#1ce4d2] font-bold text-xs tracking-wider ml-3 placeholder:text-[#1ce4d2]/60"
                />
              </div>
            )}

            {/* CIDADE */}
            {(!usarApi || tab === "cadastro") && (
              <div className="flex items-center bg-white rounded-full px-4 h-12 shadow-sm">
                <MapPin className="size-5 text-[#1ce4d2]" />
                <input
                  type="text"
                  placeholder="CIDADE (EX: SP)"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-[#1ce4d2] font-bold text-xs tracking-wider ml-3 placeholder:text-[#1ce4d2]/60"
                />
              </div>
            )}

            {/* APP UTILIZADO */}
            {(!usarApi || tab === "cadastro") && (
              <div className="flex items-center bg-white rounded-full px-4 h-12 shadow-sm">
                <Smartphone className="size-5 text-[#1ce4d2]" />
                <input
                  type="text"
                  placeholder="PHONE NUMBER / APP"
                  value={appUtilizado}
                  onChange={(e) => setAppUtilizado(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-[#1ce4d2] font-bold text-xs tracking-wider ml-3 placeholder:text-[#1ce4d2]/60"
                />
              </div>
            )}

            {/* SUBMIT BUTTON - Fiel à imagem original (Pequeno e centralizado) */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 mx-auto bg-white text-[#1ce4d2] font-extrabold tracking-widest text-[11px] px-8 py-3 rounded-full shadow-md hover:scale-105 active:scale-95 transition-transform flex items-center justify-center min-w-[120px]"
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "SUBMIT"
              )}
            </button>
          </form>
        </div>

        {/* Footer Text Falso (Como na imagem) */}
        <div className="absolute bottom-4 z-10 text-white font-semibold text-sm opacity-90 flex items-center gap-1">
          criado por <span className="font-bold flex items-center gap-1">Joaoof</span>
        </div>
      </div>
    </>
  )
} 