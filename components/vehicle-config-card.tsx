"use client"

import { useState } from "react"
import { Bike, RefreshCw, Settings2, Droplet, Gauge, Wrench } from "lucide-react"
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
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        .font-outfit { font-family: 'Outfit', sans-serif; }
      `}} />

      <Card className="rounded-[24px] border border-slate-200 bg-white shadow-sm overflow-hidden font-outfit">
        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-5 pt-6 px-6">
          <CardTitle className="flex items-center gap-3 text-slate-800 text-lg font-extrabold uppercase tracking-wide">
            <div className="flex items-center justify-center size-10 rounded-xl bg-[#1ce4d2]/10 border border-[#1ce4d2]/20">
              <Settings2 className="size-5 text-[#129e91]" strokeWidth={2.5} />
            </div>
            Calibragem da Moto
          </CardTitle>
          <CardDescription className="text-slate-500 font-medium text-xs mt-2 leading-relaxed">
            Estes dados são o coração do aplicativo. Mantenha-os atualizados para que o cálculo do seu lucro real seja impecável.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 px-6 pb-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* MODELO DA MOTO */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="modelo" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Bike className="size-3.5 text-[#1ce4d2]" strokeWidth={3} /> 
                Modelo do Veículo
              </Label>
              <Input
                id="modelo"
                value={form.modelo}
                onChange={(e) => setForm({ ...form, modelo: e.target.value })}
                placeholder="Ex: Honda CG 160 Titan"
                className="h-12 rounded-xl border-slate-200 bg-slate-50 text-slate-800 font-bold text-base placeholder:text-slate-300 placeholder:font-medium focus-visible:ring-[#1ce4d2]"
              />
            </div>

            {/* AGRUPAMENTO: CONSUMO E GASOLINA */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="consumo" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Gauge className="size-3.5 text-[#1ce4d2]" strokeWidth={3} /> 
                  Faz Quantos KM/L?
                </Label>
                <div className="relative">
                  <Input
                    id="consumo"
                    type="number"
                    min={1}
                    step={0.1}
                    value={form.consumoMedioKmL}
                    onChange={(e) => setForm({ ...form, consumoMedioKmL: parseFloat(e.target.value) || 0 })}
                    className="h-12 rounded-xl border-slate-200 bg-slate-50 text-slate-800 font-bold text-lg focus-visible:ring-[#1ce4d2] pr-10"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">km/l</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="precoGasolina" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Droplet className="size-3.5 text-[#1ce4d2]" strokeWidth={3} /> 
                  Preço do Litro
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">R$</span>
                  <Input
                    id="precoGasolina"
                    type="number"
                    min={0}
                    step={0.01}
                    value={form.precoLitroGasolina}
                    onChange={(e) => setForm({ ...form, precoLitroGasolina: parseFloat(e.target.value) || 0 })}
                    className="h-12 rounded-xl border-slate-200 bg-slate-50 text-slate-800 font-bold text-lg focus-visible:ring-[#1ce4d2] pl-8"
                  />
                </div>
              </div>
            </div>

            {/* RESERVA DE MANUTENÇÃO */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
              <Label htmlFor="reservaManutencao" className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="size-3.5 text-[#1ce4d2]" strokeWidth={3} /> 
                Caixinha de Manutenção (Por KM)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">R$</span>
                <Input
                  id="reservaManutencao"
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.reservaManutencaoKm}
                  onChange={(e) => setForm({ ...form, reservaManutencaoKm: parseFloat(e.target.value) || 0 })}
                  className="h-12 rounded-xl border-slate-200 bg-slate-50 text-slate-800 font-bold text-lg focus-visible:ring-[#1ce4d2] pl-8"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-1 ml-1 leading-relaxed">
                Recomendado: <strong>R$ 0,10 a R$ 0,20</strong>. Esse dinheiro é descontado do seu lucro para garantir a troca de óleo, pneu e relação.
              </p>
            </div>

            {/* BOTÃO SUBMIT */}
            <Button
              type="submit"
              disabled={isUpdating}
              className="w-full h-14 mt-4 rounded-xl bg-[#1ce4d2] hover:bg-[#129e91] text-slate-900 font-extrabold tracking-widest uppercase text-sm shadow-[0_4px_14px_0_rgba(28,228,210,0.39)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="size-5 animate-spin" strokeWidth={2.5} />
                  SALVANDO DADOS...
                </>
              ) : (
                <>
                  ATUALIZAR CÁLCULOS
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  )
}