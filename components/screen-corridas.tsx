"use client"

import { useState } from "react"
import { Plus, Route, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { WhatsAppShare } from "@/components/whatsapp-share"
import { formatarMoeda } from "@/lib/dashboard-store"
import type { CorridaDto } from "@/lib/types"

interface ScreenCorridasProps {
  corridas: CorridaDto[]
  onAddCorrida: (corrida: Omit<CorridaDto, "id" | "motoristaId" | "criadoEm">) => void
  onRemoveCorrida: (id: string | number) => void
  horasTrabalhadas?: number
}

export function ScreenCorridas({ corridas, onAddCorrida, onRemoveCorrida, horasTrabalhadas = 8.5 }: ScreenCorridasProps) {
  const [valor, setValor] = useState("")
  const [km, setKm] = useState("")
  const [plataforma, setPlataforma] = useState("iFood")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!valor || !km) return
    onAddCorrida({
      data: new Date().toISOString().split("T")[0],
      valorCorrida: parseFloat(valor),
      kmRodado: parseFloat(km),
      plataforma,
    })
    setValor("")
    setKm("")
  }

  const hoje = new Date().toISOString().split("T")[0]
  const corridasHoje = corridas.filter((c) => c.data === hoje)
  const corridasAnteriores = corridas.filter((c) => c.data !== hoje)

  const totalHoje = corridasHoje.reduce((s, c) => s + c.valorCorrida, 0)
  const kmHoje = corridasHoje.reduce((s, c) => s + c.kmRodado, 0)

  return (
    <div className="flex flex-col gap-6">
      {/* Cadastrar Corrida */}
      <Card className="rounded-xl border-border bg-card shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-foreground text-base">
            <div className="flex items-center justify-center size-9 rounded-lg bg-[var(--emerald-light)]">
              <Plus className="size-5 text-primary" />
            </div>
            Cadastrar Corrida
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Registre cada entrega para acompanhar seus ganhos em tempo real
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="valorCorrida" className="text-sm font-medium text-foreground">
                  Valor da Corrida (R$)
                </Label>
                <Input
                  id="valorCorrida"
                  type="number"
                  min={0}
                  step={0.5}
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder="18.50"
                  required
                  className="h-12 rounded-xl bg-secondary border-border text-foreground text-base font-mono"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="kmCorrida" className="text-sm font-medium text-foreground">
                  KM Rodado
                </Label>
                <Input
                  id="kmCorrida"
                  type="number"
                  min={0}
                  step={0.1}
                  value={km}
                  onChange={(e) => setKm(e.target.value)}
                  placeholder="6.2"
                  required
                  className="h-12 rounded-xl bg-secondary border-border text-foreground text-base font-mono"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="plataforma" className="text-sm font-medium text-foreground">
                  Plataforma
                </Label>
                <select
                  id="plataforma"
                  value={plataforma}
                  onChange={(e) => setPlataforma(e.target.value)}
                  className="h-12 rounded-xl bg-secondary border border-border text-foreground text-base px-3 appearance-none"
                >
                  <option value="iFood">iFood</option>
                  <option value="99Food">99Food</option>
                  <option value="Rappi">Rappi</option>
                  <option value="Uber Eats">Uber Eats</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>
            <Button
              type="submit"
              className="h-12 rounded-xl text-base font-semibold bg-primary text-primary-foreground hover:bg-emerald-glow sm:max-w-[240px]"
            >
              <Plus className="size-5 mr-2" />
              Registrar Corrida
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Resumo de Hoje */}
      <Card className="rounded-2xl border-border bg-card shadow-sm">
        <CardContent className="pt-5 pb-5 px-5">
          <p className="text-sm font-semibold text-foreground mb-3">Resumo do Dia</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Ganho</p>
              <p className="text-2xl font-bold font-mono text-primary mt-1">{formatarMoeda(totalHoje)}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{corridasHoje.length} corrida{corridasHoje.length !== 1 ? "s" : ""}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">KM Rodados</p>
              <p className="text-2xl font-bold font-mono text-foreground mt-1">{kmHoje.toFixed(1)} km</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Total percorrido</p>
            </div>
          </div>
          <WhatsAppShare
            lucroReal={totalHoje}
            kmRodado={kmHoje}
            valorHora={horasTrabalhadas > 0 ? totalHoje / horasTrabalhadas : 0}
          />
        </CardContent>
      </Card>

      {/* Lista de Corridas de Hoje */}
      {corridasHoje.length > 0 && (
        <Card className="rounded-xl border-border bg-card shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-foreground flex items-center gap-2">
              <Route className="size-4 text-primary" />
              Corridas de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="divide-y divide-border">
              {corridasHoje.map((corrida) => (
                <div key={corrida.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-lg bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                      {corrida.plataforma}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{formatarMoeda(corrida.valorCorrida)}</p>
                      <p className="text-xs text-muted-foreground">{corrida.kmRodado} km</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveCorrida(String(corrida.id))}
                    className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                    aria-label="Remover corrida"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Corridas Anteriores */}
      {corridasAnteriores.length > 0 && (
        <Card className="rounded-xl border-border bg-card shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-foreground">Corridas Anteriores</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="divide-y divide-border">
              {corridasAnteriores.map((corrida) => (
                <div key={corrida.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center rounded-lg bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                      {corrida.plataforma}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{formatarMoeda(corrida.valorCorrida)}</p>
                      <p className="text-xs text-muted-foreground">{corrida.kmRodado} km &middot; {corrida.data}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveCorrida(String(corrida.id))}
                    className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                    aria-label="Remover corrida"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
