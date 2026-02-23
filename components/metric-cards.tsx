"use client"

import { TrendingUp, Scale, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatarMoeda, custoFixoDiario } from "@/lib/dashboard-store"

interface MetricCardsProps {
  lucroReal: number
  ganhoBruto: number
  custosOperacionais: number
  horasTrabalhadas: number
}

export function MetricCards({
  lucroReal,
  ganhoBruto,
  custosOperacionais,
  horasTrabalhadas,
}: MetricCardsProps) {
  const custosTotaisDia = custosOperacionais + custoFixoDiario
  const pontoEquilibrio = Math.min((ganhoBruto / custosTotaisDia) * 100, 100)
  const faltaParaEquilibrio = Math.max(custosTotaisDia - ganhoBruto, 0)
  const valorHoraLiquida = horasTrabalhadas > 0 ? lucroReal / horasTrabalhadas : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Lucro Real */}
      <Card className="relative rounded-xl border-border bg-card shadow-sm overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
        <CardContent className="pt-6 pb-5 px-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center size-8 rounded-lg bg-[var(--emerald-light)]">
              <TrendingUp className="size-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Lucro Real</span>
          </div>
          <p
            className={`text-3xl lg:text-4xl font-bold font-mono tracking-tight ${
              lucroReal >= 0 ? "text-primary" : "text-destructive"
            }`}
          >
            {formatarMoeda(lucroReal)}
          </p>
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            {"Ganhos Brutos ("}{formatarMoeda(ganhoBruto)}{") \u2212 Custos ("}{formatarMoeda(custosOperacionais)}{")"}
          </p>
        </CardContent>
      </Card>

      {/* Ponto de Equilíbrio */}
      <Card className="relative rounded-xl border-border bg-card shadow-sm overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 bg-accent" />
        <CardContent className="pt-6 pb-5 px-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center size-8 rounded-lg bg-[var(--orange-light)]">
              <Scale className="size-4 text-accent" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Ponto de Equilíbrio</span>
          </div>
          <p className="text-3xl lg:text-4xl font-bold font-mono tracking-tight text-foreground">
            {pontoEquilibrio.toFixed(0)}%
          </p>
          <Progress
            value={pontoEquilibrio}
            className="mt-3 h-2.5 bg-secondary rounded-full [&>[data-slot=progress-indicator]]:bg-accent [&>[data-slot=progress-indicator]]:rounded-full"
          />
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            {faltaParaEquilibrio > 0
              ? `Faltam ${formatarMoeda(faltaParaEquilibrio)} para cobrir custos fixos`
              : "Custos fixos cobertos! Agora é lucro puro."}
          </p>
        </CardContent>
      </Card>

      {/* Valor da Hora Líquida */}
      <Card className="relative rounded-xl border-border bg-card shadow-sm overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 bg-chart-1" />
        <CardContent className="pt-6 pb-5 px-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center size-8 rounded-lg bg-blue-50">
              <Clock className="size-4 text-chart-1" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Valor da Hora Líquida</span>
          </div>
          <p className="text-3xl lg:text-4xl font-bold font-mono tracking-tight text-foreground">
            {formatarMoeda(valorHoraLiquida)}
            <span className="text-base font-normal text-muted-foreground">/h</span>
          </p>
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            Lucro real dividido por {horasTrabalhadas.toFixed(1)}h trabalhadas
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
