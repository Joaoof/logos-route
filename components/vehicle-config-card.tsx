"use client"

import { useState } from "react"
import { Bike, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import type { VeiculoConfigDto } from "@/lib/types"

interface VehicleConfigCardProps {
  veiculo: VeiculoConfigDto
  onUpdate: (config: VeiculoConfigDto) => void
}

export function VehicleConfigCard({ veiculo, onUpdate }: VehicleConfigCardProps) {
  const [form, setForm] = useState<VeiculoConfigDto>(veiculo)
  const [isUpdating, setIsUpdating] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsUpdating(true)
    setTimeout(() => {
      onUpdate(form)
      setIsUpdating(false)
    }, 400)
  }

  return (
    <Card className="rounded-xl border-border bg-card shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-foreground text-base">
          <div className="flex items-center justify-center size-9 rounded-lg bg-[var(--emerald-light)]">
            <Bike className="size-5 text-primary" />
          </div>
          Configurar Moto
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Ajuste os dados do seu veículo para cálculos precisos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="modelo" className="text-sm font-medium text-foreground">
              Modelo
            </Label>
            <Input
              id="modelo"
              value={form.modelo}
              onChange={(e) => setForm({ ...form, modelo: e.target.value })}
              placeholder="Honda CG 160 Titan"
              className="h-12 rounded-xl bg-secondary border-border text-foreground placeholder:text-muted-foreground text-base"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="consumo" className="text-sm font-medium text-foreground">
              Consumo Médio km/L
            </Label>
            <Input
              id="consumo"
              type="number"
              min={1}
              step={0.1}
              value={form.consumoMedioKmL}
              onChange={(e) =>
                setForm({ ...form, consumoMedioKmL: parseFloat(e.target.value) || 0 })
              }
              className="h-12 rounded-xl bg-secondary border-border text-foreground text-base font-mono"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="precoGasolina" className="text-sm font-medium text-foreground">
              Preço do Litro da Gasolina (R$)
            </Label>
            <Input
              id="precoGasolina"
              type="number"
              min={0}
              step={0.01}
              value={form.precoLitroGasolina}
              onChange={(e) =>
                setForm({ ...form, precoLitroGasolina: parseFloat(e.target.value) || 0 })
              }
              className="h-12 rounded-xl bg-secondary border-border text-foreground text-base font-mono"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="reservaManutencao" className="text-sm font-medium text-foreground">
              Reserva de Manutenção por KM (R$)
            </Label>
            <Input
              id="reservaManutencao"
              type="number"
              min={0}
              step={0.01}
              value={form.reservaManutencaoKm}
              onChange={(e) =>
                setForm({ ...form, reservaManutencaoKm: parseFloat(e.target.value) || 0 })
              }
              className="h-12 rounded-xl bg-secondary border-border text-foreground text-base font-mono"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isUpdating}
            className="h-14 rounded-xl text-base font-semibold bg-primary text-primary-foreground hover:bg-emerald-glow transition-all duration-200 mt-1"
          >
            {isUpdating ? (
              <RefreshCw className="size-5 animate-spin mr-2" />
            ) : (
              <RefreshCw className="size-5 mr-2" />
            )}
            Atualizar Cálculos
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
