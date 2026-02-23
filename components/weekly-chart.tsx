"use client"

import {
  Bar,
  BarChart,
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
import type { DadosDiariosDto } from "@/lib/types"

const CHART_BLUE = "#2563EB"
const CHART_ORANGE = "#EA580C"

const chartConfig = {
  faturamentoBruto: {
    label: "Faturamento Bruto",
    color: CHART_BLUE,
  },
  custoRodagem: {
    label: "Custo de Rodagem Real",
    color: CHART_ORANGE,
  },
}

interface WeeklyChartProps {
  dados: DadosDiariosDto[]
}

export function WeeklyChart({ dados }: WeeklyChartProps) {
  return (
    <Card className="rounded-xl border-border bg-card shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-foreground text-base">Faturamento vs Custo de Rodagem</CardTitle>
        <CardDescription className="text-muted-foreground">
          Comparativo dos últimos 7 dias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[280px] lg:h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dados}
              margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
              barCategoryGap="20%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E2E8F0"
              />
              <XAxis
                dataKey="dia"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748B", fontSize: 13, fontWeight: 500 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748B", fontSize: 12 }}
                tickFormatter={(value: number) => `R$${value}`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) =>
                      `R$ ${Number(value).toFixed(2)}`
                    }
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="faturamentoBruto"
                fill={CHART_BLUE}
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
              <Bar
                dataKey="custoRodagem"
                fill={CHART_ORANGE}
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
