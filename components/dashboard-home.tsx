"use client"

import { useState } from "react"
import {
  TrendingUp,
  MapPin,
  Clock,
  Route,
  ChevronRight,
  Zap,
  ReceiptText,
  X,
  Fuel,
  Droplet,
  Coffee
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { WhatsAppShare } from "@/components/whatsapp-share"
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  formatarMoeda,
  custoFixoDiario,
} from "@/lib/dashboard-store"
import type { DadosDiariosDto, DadosMensaisDto } from "@/lib/types"

// Paleta baseada na imagem de referência
const THEME_CYAN = "#1ce4d2"
const THEME_CYAN_DARK = "#129e91"

const chartConfig = {
  faturamentoBruto: { label: "Faturamento", color: THEME_CYAN },
  custoRodagem: { label: "Custos", color: THEME_CYAN_DARK },
}

type ChartPeriod = "semanal" | "mensal"

interface DashboardHomeProps {
  lucroReal: number
  ganhoBruto: number
  custosOperacionais: number
  kmRodado: number
  horasTrabalhadas: number
  motoristaName?: string
  dadosSemanais: DadosDiariosDto[]
  dadosMensais: DadosMensaisDto[]
  onNavigate: (id: string) => void
}

export function DashboardHome({
  lucroReal,
  ganhoBruto,
  custosOperacionais,
  kmRodado,
  horasTrabalhadas,
  motoristaName,
  dadosSemanais,
  dadosMensais,
  onNavigate,
}: DashboardHomeProps) {
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("semanal")
  
  // Estado para controlar a modal flutuante de gastos
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  
  const custosTotaisDia = custosOperacionais + custoFixoDiario
  const pontoEquilibrio = Math.min((ganhoBruto / (custosTotaisDia || 1)) * 100, 100)
  const faltaParaEquilibrio = Math.max(custosTotaisDia - ganhoBruto, 0)
  const valorHoraLiquida = horasTrabalhadas > 0 ? lucroReal / horasTrabalhadas : 0

  const chartData =
    chartPeriod === "semanal"
      ? dadosSemanais
      : dadosMensais.map((d) => ({
          dia: d.semana,
          faturamentoBruto: d.faturamentoBruto,
          custoRodagem: d.custoRodagem,
        }))

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap');
        .font-outfit { font-family: 'Outfit', sans-serif; }
      `}} />

      {/* DASHBOARD PRINCIPAL INTACTO */}
      <div className="flex flex-col gap-5 font-outfit relative">
        
        {/* ====== WELCOME CARD ====== */}
        <Card className="rounded-[28px] border-none bg-white shadow-[0_10px_40px_-10px_rgba(28,228,210,0.2)] overflow-hidden">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="relative size-16 shrink-0 flex items-center justify-center drop-shadow-sm">
              <svg width="60" height="66" viewBox="0 0 100 110" fill="none" className="absolute inset-0 w-full h-full">
                <path d="M50 4L89.8366 27V73L50 96L10.1634 73V27L50 4Z" fill={THEME_CYAN} opacity="0.15"/>
                <path d="M50 8L86.3718 29V71L50 92L13.6282 71V29L50 8Z" stroke={THEME_CYAN} strokeWidth="3"/>
              </svg>
              <span className="text-2xl font-extrabold text-[#1ce4d2] z-10 uppercase">
                {motoristaName ? motoristaName.charAt(0) : "M"}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[17px] font-extrabold text-slate-800 truncate tracking-tight">
                Olá, {motoristaName || "Motorista"}
              </p>
              <button
                onClick={() => onNavigate("moto")}
                className="text-xs text-[#1ce4d2] font-bold flex items-center gap-1 mt-1 hover:opacity-80 transition-opacity"
              >
                CONFIGURAR MOTO
                <ChevronRight className="size-3" strokeWidth={3} />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* ====== HORIZONTAL TAB ROW ====== */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
          <button onClick={() => onNavigate("corridas")} className="flex items-center gap-2 shrink-0 bg-white border-2 border-slate-100/50 rounded-full px-5 py-2.5 shadow-sm active:scale-95 transition-transform hover:border-[#1ce4d2]/30">
            <Route className="size-4 text-[#1ce4d2]" strokeWidth={2.5} />
            <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">Corridas</span>
          </button>
          <button onClick={() => onNavigate("relatorios")} className="flex items-center gap-2 shrink-0 bg-white border-2 border-slate-100/50 rounded-full px-5 py-2.5 shadow-sm active:scale-95 transition-transform hover:border-[#1ce4d2]/30">
            <TrendingUp className="size-4 text-[#1ce4d2]" strokeWidth={2.5} />
            <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">Relatórios</span>
          </button>
          <button onClick={() => onNavigate("metas")} className="flex items-center gap-2 shrink-0 bg-white border-2 border-slate-100/50 rounded-full px-5 py-2.5 shadow-sm active:scale-95 transition-transform hover:border-[#1ce4d2]/30">
            <Zap className="size-4 text-[#1ce4d2]" strokeWidth={2.5} />
            <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">Metas</span>
          </button>
        </div>

        {/* ====== MAIN STATS CARD ====== */}
        <Card className="rounded-[32px] border-none bg-white shadow-[0_15px_50px_-12px_rgba(28,228,210,0.15)] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#1ce4d2] opacity-[0.03] rounded-bl-full pointer-events-none" />
          
          <CardContent className="p-6 relative z-10">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lucro Real Hoje</p>
                <p className="text-[11px] text-slate-400 font-medium mt-1">
                  {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}
                </p>
              </div>
              <div className={`flex items-center gap-1 text-sm font-extrabold px-3 py-1 rounded-full ${lucroReal >= 0 ? "bg-[#1ce4d2]/10 text-[#129e91]" : "bg-red-50 text-red-500"}`}>
                {lucroReal >= 0 ? "+" : ""}{((lucroReal / (ganhoBruto || 1)) * 100).toFixed(0)}%
                <TrendingUp className="size-3.5" strokeWidth={3} />
              </div>
            </div>

            <div className="flex flex-col gap-1 mt-4">
              <p className={`text-4xl font-extrabold tracking-tight ${lucroReal >= 0 ? "text-slate-800" : "text-red-500"}`}>
                {formatarMoeda(lucroReal)}
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <span>Bruto: <strong className="text-slate-600">{formatarMoeda(ganhoBruto)}</strong></span>
                <span className="text-slate-300">•</span>
                <span>Custos: <strong className="text-slate-600">{formatarMoeda(custosTotaisDia)}</strong></span>
              </div>
            </div>

            {/* Mini stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t-2 border-slate-50">
              <div className="text-center">
                <MapPin className="size-5 text-[#1ce4d2] mx-auto mb-2" strokeWidth={2.5} />
                <p className="text-lg font-bold text-slate-800">{kmRodado.toFixed(1)}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Km</p>
              </div>
              <div className="text-center border-x-2 border-slate-50">
                <Clock className="size-5 text-[#1ce4d2] mx-auto mb-2" strokeWidth={2.5} />
                <p className="text-lg font-bold text-slate-800">{formatarMoeda(valorHoraLiquida)}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Por Hora</p>
              </div>
              <div className="text-center">
                <Route className="size-5 text-[#1ce4d2] mx-auto mb-2" strokeWidth={2.5} />
                <p className="text-lg font-bold text-slate-800">{horasTrabalhadas.toFixed(1)}h</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Trabalho</p>
              </div>
            </div>

            {/* Break-even Progress */}
            <div className="mt-5 pt-5 border-t-2 border-slate-50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ponto de Equilíbrio</span>
                <span className="text-xs font-extrabold text-[#1ce4d2]">{pontoEquilibrio.toFixed(0)}%</span>
              </div>
              <Progress value={pontoEquilibrio} className="h-3 bg-slate-100 rounded-full [&>[data-slot=progress-indicator]]:bg-[#1ce4d2]" />
              <p className="text-[11px] font-medium text-slate-400 mt-2 text-center">
                {faltaParaEquilibrio > 0
                  ? `Faltam ${formatarMoeda(faltaParaEquilibrio)} para o lucro puro`
                  : "Custos do dia cobertos! 🚀"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ====== CHART CARD ====== */}
        <Card className="rounded-[32px] border-none bg-white shadow-[0_15px_50px_-12px_rgba(28,228,210,0.15)] overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm font-extrabold text-slate-800 tracking-wide uppercase">Desempenho</p>
              <div className="flex bg-slate-50 rounded-full p-1 border border-slate-100">
                <button
                  onClick={() => setChartPeriod("semanal")}
                  className={`px-4 py-1.5 rounded-full text-[11px] font-extrabold transition-all uppercase tracking-wide ${
                    chartPeriod === "semanal" ? "bg-white text-[#1ce4d2] shadow-sm" : "text-slate-400"
                  }`}
                >
                  Semana
                </button>
                <button
                  onClick={() => setChartPeriod("mensal")}
                  className={`px-4 py-1.5 rounded-full text-[11px] font-extrabold transition-all uppercase tracking-wide ${
                    chartPeriod === "mensal" ? "bg-white text-[#1ce4d2] shadow-sm" : "text-slate-400"
                  }`}
                >
                  Mês
                </button>
              </div>
            </div>

            <ChartContainer config={chartConfig} className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="dia" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: 'Outfit', fontWeight: 600 }} dy={10} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: 'Outfit', fontWeight: 600 }} tickFormatter={(v) => `${v}`} />
                  <ChartTooltip cursor={{fill: '#f8fafc'}} content={<ChartTooltipContent formatter={(v) => `R$ ${Number(v).toFixed(2)}`} />} />
                  <Bar dataKey="faturamentoBruto" fill={THEME_CYAN} radius={[6, 6, 0, 0]} maxBarSize={32} />
                  <Bar dataKey="custoRodagem" fill={THEME_CYAN_DARK} radius={[6, 6, 0, 0]} maxBarSize={32} opacity={0.3} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Whatsapp Share */}
        <WhatsAppShare lucroReal={lucroReal} kmRodado={kmRodado} valorHora={valorHoraLiquida} />
      </div>

      {/* ========================================= */}
      {/* ====== BOTÃO FLUTUANTE & MODAL ====== */}
      {/* ========================================= */}

      {/* Ícone Flutuante (FAB) */}
      <button
        onClick={() => setIsExpenseModalOpen(true)}
        className="fixed bottom-24 right-5 size-14 bg-[#1ce4d2] text-white rounded-full shadow-[0_10px_25px_-5px_rgba(28,228,210,0.5)] flex items-center justify-center z-40 hover:scale-105 active:scale-95 transition-all font-outfit"
      >
        <ReceiptText className="size-6" strokeWidth={2.5} />
        {/* Ponto de Notificação pulsante */}
        <span className="absolute top-3 right-3.5 size-3 bg-red-500 rounded-full animate-pulse border-2 border-[#1ce4d2]" />
      </button>

      {/* Overlay da Modal */}
      {isExpenseModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 font-outfit"
          onClick={() => setIsExpenseModalOpen(false)} // Fecha ao clicar fora
        >
          {/* Corpo da Modal */}
          <div 
            className="bg-white rounded-[32px] w-full max-w-sm p-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()} // Evita fechar ao clicar dentro
          >
            <button 
              onClick={() => setIsExpenseModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 transition-colors"
            >
              <X className="size-5" strokeWidth={3} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-full bg-red-50 flex items-center justify-center">
                <ReceiptText className="size-5 text-red-500" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">Gastos de Hoje</h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Despesas Registradas</p>
              </div>
            </div>

            {/* Lista de Gastos */}
            <div className="flex flex-col gap-4">
              
              {/* Custos Operacionais */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-500">
                    <Fuel className="size-4" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">Combustível</p>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">Custo Operacional</p>
                  </div>
                </div>
                <p className="text-sm font-extrabold text-slate-800">{formatarMoeda(custosOperacionais * 0.8)}</p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-500">
                    <Droplet className="size-4" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">Reserva de Óleo/Peças</p>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">Custo Operacional</p>
                  </div>
                </div>
                <p className="text-sm font-extrabold text-slate-800">{formatarMoeda(custosOperacionais * 0.2)}</p>
              </div>

              {/* Linha Divisória */}
              <div className="h-px w-full bg-slate-100 my-1" />

              {/* Custos Pessoais */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 border border-amber-100/50">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-white shadow-sm flex items-center justify-center text-amber-500">
                    <Coffee className="size-4" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700">Alimentação</p>
                    <p className="text-[10px] font-semibold text-amber-500/80 uppercase">Custo Pessoal</p>
                  </div>
                </div>
                <p className="text-sm font-extrabold text-slate-800">R$ 25,00</p>
              </div>

            </div>

            {/* Totalizador */}
            <div className="mt-6 p-4 rounded-2xl bg-[#1ce4d2]/10 flex items-center justify-between">
              <span className="text-sm font-extrabold text-[#129e91] uppercase tracking-wide">Total Deduzido</span>
              <span className="text-xl font-extrabold text-[#129e91]">
                {formatarMoeda(custosOperacionais + 25)}
              </span>
            </div>

            <button 
              onClick={() => setIsExpenseModalOpen(false)}
              className="w-full mt-4 py-3 rounded-full bg-[#1ce4d2] text-white font-extrabold text-xs uppercase tracking-widest shadow-md active:scale-95 transition-transform"
            >
              FECHAR E VOLTAR AO TRABALHO
            </button>
          </div>
        </div>
      )}
    </>
  )
} 