"use client"

import { useState } from "react"
import { BookOpen, Moon, Plus, Minus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { MetaMordomiaDto } from "@/lib/types"

interface CircularProgressProps {
  value: number
  max: number
  label: string
  sublabel: string
  color: string
  trackColor: string
  icon: React.ReactNode
}

function CircularProgress({ value, max, label, sublabel, color, trackColor, icon }: CircularProgressProps) {
  const percentage = Math.min((value / max) * 100, 100)
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  function formatMinutes(min: number): string {
    const h = Math.floor(min / 60)
    const m = min % 60
    if (h > 0 && m > 0) return `${h}h${m.toString().padStart(2, "0")}m`
    if (h > 0) return `${h}h`
    return `${m}m`
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex items-center justify-center size-32 lg:size-36">
        <svg
          className="rotate-[-90deg] size-full"
          viewBox="0 0 120 120"
          aria-label={`${label}: ${percentage.toFixed(0)}% completo`}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="mb-1" style={{ color }}>{icon}</div>
          <span className="text-sm font-bold font-mono text-foreground">
            {formatMinutes(value)}
          </span>
          <span className="text-[10px] text-muted-foreground">
            de {formatMinutes(max)}
          </span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{sublabel}</p>
      </div>
    </div>
  )
}

interface StewardshipWidgetProps {
  metas: MetaMordomiaDto
  editable?: boolean
  onUpdateMetas?: (metas: MetaMordomiaDto) => void
}

export function StewardshipWidget({ metas, editable = false, onUpdateMetas }: StewardshipWidgetProps) {
  const [localMetas, setLocalMetas] = useState(metas)
  const activeMetas = editable ? localMetas : metas

  function adjustMinutes(field: "estudoTeoMinutos" | "descansoMinutos", delta: number) {
    const updated = { ...localMetas, [field]: Math.max(0, localMetas[field] + delta) }
    setLocalMetas(updated)
    onUpdateMetas?.(updated)
  }

  return (
    <Card className="rounded-xl border-border bg-card shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-foreground text-base">
          <div className="flex items-center justify-center size-9 rounded-lg bg-[var(--orange-light)]">
            <BookOpen className="size-5 text-accent" />
          </div>
          Metas de Mordomia
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Equilibre trabalho, estudo e descanso. Previna o burnout.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-around gap-6">
          <div className="flex flex-col items-center gap-2">
            <CircularProgress
              value={activeMetas.estudoTeoMinutos}
              max={activeMetas.estudoTeoMeta}
              label="Estudo Teológico/Técnico"
              sublabel={`${Math.round((activeMetas.estudoTeoMinutos / activeMetas.estudoTeoMeta) * 100)}% da meta diária`}
              color="#059669"
              trackColor="#D1FAE5"
              icon={<BookOpen className="size-5" />}
            />
            {editable && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="size-9 rounded-lg p-0" onClick={() => adjustMinutes("estudoTeoMinutos", -15)}>
                  <Minus className="size-4" />
                </Button>
                <Button variant="outline" size="sm" className="size-9 rounded-lg p-0" onClick={() => adjustMinutes("estudoTeoMinutos", 15)}>
                  <Plus className="size-4" />
                </Button>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center gap-2">
            <CircularProgress
              value={activeMetas.descansoMinutos}
              max={activeMetas.descansoMeta}
              label="Descanso Físico"
              sublabel={`${Math.round((activeMetas.descansoMinutos / activeMetas.descansoMeta) * 100)}% da meta diária`}
              color="#EA580C"
              trackColor="#FFF7ED"
              icon={<Moon className="size-5" />}
            />
            {editable && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="size-9 rounded-lg p-0" onClick={() => adjustMinutes("descansoMinutos", -30)}>
                  <Minus className="size-4" />
                </Button>
                <Button variant="outline" size="sm" className="size-9 rounded-lg p-0" onClick={() => adjustMinutes("descansoMinutos", 30)}>
                  <Plus className="size-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
