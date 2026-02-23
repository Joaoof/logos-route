"use client"

import { useState } from "react"
import {
  TrendingUp,
  MapPin,
  Clock,
  Route,
  ChevronRight,
  Zap,
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

const BLUE = "#2563EB"
const ORANGE = "#EA580C"

const chartConfig = {
  faturamentoBruto: { label: "Faturamento", color: BLUE },
  custoRodagem: { label: "Custos", color: ORANGE },
}

type ChartPeriod = "semanal" | "mensal"
type DashTab = "resumo" | "faturamento" | "chart"

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
  const custosTotaisDia = custosOperacionais + custoFixoDiario
  const pontoEquilibrio = Math.min((ganhoBruto / custosTotaisDia) * 100, 100)
  const faltaParaEquilibrio = Math.max(custosTotaisDia - ganhoBruto, 0)
  const valorHoraLiquida = horasTrabalhadas > 0 ? lucroReal / horasTrabalhadas : 0

  // Chart data based on period
  const chartData =
    chartPeriod === "semanal"
      ? dadosSemanais
      : dadosMensais.map((d) => ({
          dia: d.semana,
          faturamentoBruto: d.faturamentoBruto,
          custoRodagem: d.custoRodagem,
        }))

  return (
    <div className="flex flex-col gap-4">
      {/* ====== WELCOME CARD ====== */}
      <Card className="rounded-2xl border-border bg-card shadow-sm overflow-hidden">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="size-14 shrink-0 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
            <span className="text-xl font-bold text-primary">
              {motoristaName ? motoristaName.charAt(0).toUpperCase() : "M"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-foreground truncate">
              Bem-vindo, {motoristaName || "Motorista"}!
            </p>
            <button
              onClick={() => onNavigate("moto")}
              className="text-sm text-primary font-medium flex items-center gap-0.5 mt-0.5"
            >
              Editar Perfil
              <ChevronRight className="size-3.5" />
            </button>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 bg-[var(--emerald-light)] rounded-full px-3 py-1.5">
            <span className="size-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold text-primary">Online</span>
          </div>
        </CardContent>
      </Card>

      {/* ====== HORIZONTAL TAB-LIKE STATS ROW ====== */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
        <button
          onClick={() => onNavigate("corridas")}
          className="flex items-center gap-2 shrink-0 bg-card border border-border rounded-full px-4 py-2 shadow-sm active:scale-95 transition-transform"
        >
          <Route className="size-4 text-primary" />
          <span className="text-sm font-medium text-foreground whitespace-nowrap">Minhas Corridas</span>
        </button>
        <button
          onClick={() => onNavigate("relatorios")}
          className="flex items-center gap-2 shrink-0 bg-card border border-border rounded-full px-4 py-2 shadow-sm active:scale-95 transition-transform"
        >
          <TrendingUp className="size-4 text-chart-1" />
          <span className="text-sm font-medium text-foreground whitespace-nowrap">Relatorios</span>
        </button>
        <button
          onClick={() => onNavigate("metas")}
          className="flex items-center gap-2 shrink-0 bg-card border border-border rounded-full px-4 py-2 shadow-sm active:scale-95 transition-transform"
        >
          <Zap className="size-4 text-accent" />
          <span className="text-sm font-medium text-foreground whitespace-nowrap">Metas</span>
        </button>
      </div>

      {/* ====== MAIN STATS CARD (like "Orders Fulfilled") ====== */}
      <Card className="rounded-2xl border-border bg-card shadow-sm overflow-hidden">
        <CardContent className="p-5">
          {/* Title row */}
          <div className="flex items-start justify-between mb-1">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Lucro Real Hoje</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
              </p>
            </div>
            <div className={`flex items-center gap-1 text-sm font-bold ${lucroReal >= 0 ? "text-primary" : "text-destructive"}`}>
              {lucroReal >= 0 ? "+" : ""}{((lucroReal / (ganhoBruto || 1)) * 100).toFixed(0)}%
              <TrendingUp className="size-3.5" />
            </div>
          </div>

          {/* Big numbers */}
          <div className="flex items-baseline gap-4 mt-3">
            <div>
              <p className="text-xs text-muted-foreground">Total Bruto</p>
              <p className="text-lg font-bold font-mono text-foreground">{formatarMoeda(ganhoBruto)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Lucro Real</p>
              <p className={`text-2xl font-bold font-mono ${lucroReal >= 0 ? "text-primary" : "text-destructive"}`}>
                {formatarMoeda(lucroReal)}
              </p>
            </div>
          </div>

          {/* Mini 3-col stats */}
          <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-border">
            <div className="text-center">
              <MapPin className="size-4 text-muted-foreground mx-auto mb-1" />
              <p className="text-base font-bold font-mono text-foreground">{kmRodado.toFixed(1)}</p>
              <p className="text-[10px] text-muted-foreground">km rodados</p>
            </div>
            <div className="text-center border-x border-border">
              <Clock className="size-4 text-muted-foreground mx-auto mb-1" />
              <p className="text-base font-bold font-mono text-foreground">{formatarMoeda(valorHoraLiquida)}</p>
              <p className="text-[10px] text-muted-foreground">por hora</p>
            </div>
            <div className="text-center">
              <Route className="size-4 text-muted-foreground mx-auto mb-1" />
              <p className="text-base font-bold font-mono text-foreground">{horasTrabalhadas.toFixed(1)}h</p>
              <p className="text-[10px] text-muted-foreground">trabalhadas</p>
            </div>
          </div>

          {/* Break-even */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Ponto de Equilibrio</span>
              <span className="text-xs font-bold font-mono text-foreground">{pontoEquilibrio.toFixed(0)}%</span>
            </div>
            <Progress
              value={pontoEquilibrio}
              className="h-2.5 bg-secondary rounded-full [&>[data-slot=progress-indicator]]:bg-accent [&>[data-slot=progress-indicator]]:rounded-full"
            />
            <p className="text-[10px] text-muted-foreground mt-1.5">
              {faltaParaEquilibrio > 0
                ? `Faltam ${formatarMoeda(faltaParaEquilibrio)} para cobrir custos fixos`
                : "Custos cobertos! Agora e lucro puro."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ====== CHART CARD (with period toggles like the reference) ====== */}
      <Card className="rounded-2xl border-border bg-card shadow-sm overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-foreground">Desempenho</p>
            {/* Period toggle pills */}
            <div className="flex bg-secondary rounded-full p-0.5 gap-0.5">
              <button
                onClick={() => setChartPeriod("semanal")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  chartPeriod === "semanal"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                Semanal
              </button>
              <button
                onClick={() => setChartPeriod("mensal")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  chartPeriod === "mensal"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground"
                }`}
              >
                Mensal
              </button>
            </div>
          </div>

          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                barCategoryGap="25%"
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis
                  dataKey="dia"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#64748B", fontSize: 11, fontWeight: 500 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 10 }}
                  tickFormatter={(v: number) => `${v}`}
                />
                <ChartTooltip
                  content={<ChartTooltipContent formatter={(v) => `R$ ${Number(v).toFixed(2)}`} />}
                />
                <Bar dataKey="faturamentoBruto" fill={BLUE} radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="custoRodagem" fill={ORANGE} radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Legend */}
          <div className="flex items-center justify-center gap-5 mt-3">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: BLUE }} />
              <span className="text-[11px] text-muted-foreground font-medium">Faturamento</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: ORANGE }} />
              <span className="text-[11px] text-muted-foreground font-medium">Custos</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ====== WHATSAPP SHARE ====== */}
      <WhatsAppShare lucroReal={lucroReal} kmRodado={kmRodado} valorHora={valorHoraLiquida} />
    </div>
  )
}
