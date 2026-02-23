"use client"

import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { formatarMoeda } from "@/lib/dashboard-store"
import type { DadosDiariosDto, DadosMensaisDto } from "@/lib/types"

const BLUE = "#2563EB"
const ORANGE = "#EA580C"
const EMERALD = "#059669"

const weeklyConfig = {
  faturamentoBruto: { label: "Faturamento Bruto", color: BLUE },
  custoRodagem: { label: "Custo de Rodagem", color: ORANGE },
}

const monthlyConfig = {
  faturamentoBruto: { label: "Faturamento Bruto", color: BLUE },
  custoRodagem: { label: "Custo de Rodagem", color: ORANGE },
  lucroLiquido: { label: "Lucro Líquido", color: EMERALD },
}

interface ScreenRelatoriosProps {
  dadosSemanais: DadosDiariosDto[]
  dadosMensais: DadosMensaisDto[]
}

export function ScreenRelatorios({ dadosSemanais, dadosMensais }: ScreenRelatoriosProps) {
  const totalSemana = dadosSemanais.reduce((s, d) => s + d.faturamentoBruto, 0)
  const custoSemana = dadosSemanais.reduce((s, d) => s + d.custoRodagem, 0)
  const lucroSemana = totalSemana - custoSemana
  const totalMes = dadosMensais.reduce((s, d) => s + d.faturamentoBruto, 0)
  const lucroMes = dadosMensais.reduce((s, d) => s + d.lucroLiquido, 0)

  return (
    <div className="flex flex-col gap-6">
      {/* Resumo Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-xl border-border bg-card shadow-sm">
          <CardContent className="pt-5 pb-4 px-5">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Receita Semanal</p>
            <p className="text-xl font-bold font-mono text-foreground mt-1">{formatarMoeda(totalSemana)}</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-border bg-card shadow-sm">
          <CardContent className="pt-5 pb-4 px-5">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Lucro Semanal</p>
            <p className="text-xl font-bold font-mono text-primary mt-1">{formatarMoeda(lucroSemana)}</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-border bg-card shadow-sm">
          <CardContent className="pt-5 pb-4 px-5">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Receita Mensal</p>
            <p className="text-xl font-bold font-mono text-foreground mt-1">{formatarMoeda(totalMes)}</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-border bg-card shadow-sm">
          <CardContent className="pt-5 pb-4 px-5">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Lucro Mensal</p>
            <p className="text-xl font-bold font-mono text-primary mt-1">{formatarMoeda(lucroMes)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico Semanal */}
      <Card className="rounded-xl border-border bg-card shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base text-foreground">Desempenho Semanal</CardTitle>
          <CardDescription className="text-muted-foreground">
            Faturamento Bruto (Azul) vs Custo de Rodagem Real (Laranja)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={weeklyConfig} className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosSemanais} margin={{ top: 8, right: 8, left: -12, bottom: 0 }} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="dia" tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 13, fontWeight: 500 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 12 }} tickFormatter={(v: number) => `R$${v}`} />
                <ChartTooltip content={<ChartTooltipContent formatter={(v) => `R$ ${Number(v).toFixed(2)}`} />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="faturamentoBruto" fill={BLUE} radius={[6, 6, 0, 0]} maxBarSize={40} />
                <Bar dataKey="custoRodagem" fill={ORANGE} radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Gráfico Mensal */}
      <Card className="rounded-xl border-border bg-card shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-base text-foreground">Visão Mensal por Semana</CardTitle>
          <CardDescription className="text-muted-foreground">
            Evolução do faturamento, custo e lucro líquido ao longo do mês
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={monthlyConfig} className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dadosMensais} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="semana" tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 13, fontWeight: 500 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748B", fontSize: 12 }} tickFormatter={(v: number) => `R$${v}`} />
                <ChartTooltip content={<ChartTooltipContent formatter={(v) => `R$ ${Number(v).toFixed(2)}`} />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line type="monotone" dataKey="faturamentoBruto" stroke={BLUE} strokeWidth={2.5} dot={{ r: 4, fill: BLUE }} />
                <Line type="monotone" dataKey="custoRodagem" stroke={ORANGE} strokeWidth={2.5} dot={{ r: 4, fill: ORANGE }} />
                <Line type="monotone" dataKey="lucroLiquido" stroke={EMERALD} strokeWidth={2.5} dot={{ r: 4, fill: EMERALD }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
