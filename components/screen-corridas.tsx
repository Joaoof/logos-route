"use client"

import { useState } from "react"
import { Plus, Route, Trash2, DollarSign, MapPin, Smartphone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
        .font-outfit { font-family: 'Outfit', sans-serif; }
      `}} />

      <div className="flex flex-col gap-6 font-outfit pt-2">
        
        {/* ========================================= */}
        {/* FORMULÁRIO DE CADASTRO SÓBRIO E ÁGIL      */}
        {/* ========================================= */}
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4 pt-5">
            <CardTitle className="flex items-center gap-2 text-slate-800 text-base font-bold uppercase tracking-wide">
              <Plus className="size-5 text-[#1ce4d2]" strokeWidth={3} />
              Registrar Corrida
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              <div className="grid grid-cols-2 gap-4">
                {/* VALOR */}
                <div className="flex flex-col gap-1.5">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="size-3.5" /> Valor (R$)
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    step={0.5}
                    placeholder="0.00"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    required
                    className="h-12 rounded-xl border-slate-200 bg-slate-50 text-slate-800 font-bold text-lg placeholder:text-slate-300 focus-visible:ring-[#1ce4d2]"
                  />
                </div>

                {/* KM */}
                <div className="flex flex-col gap-1.5">
                  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="size-3.5" /> Distância (KM)
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    step={0.1}
                    placeholder="0.0"
                    value={km}
                    onChange={(e) => setKm(e.target.value)}
                    required
                    className="h-12 rounded-xl border-slate-200 bg-slate-50 text-slate-800 font-bold text-lg placeholder:text-slate-300 focus-visible:ring-[#1ce4d2]"
                  />
                </div>
              </div>

              {/* PLATAFORMA */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="size-3.5" /> Aplicativo
                </Label>
                <select
                  value={plataforma}
                  onChange={(e) => setPlataforma(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-bold px-3 focus:outline-none focus:ring-2 focus:ring-[#1ce4d2] focus:border-transparent transition-all"
                >
                  <option value="iFood">iFood</option>
                  <option value="99Food">99Food</option>
                  <option value="Rappi">Rappi</option>
                  <option value="Uber Eats">Uber Eats</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              {/* BOTÃO SUBMIT */}
              <Button
                type="submit"
                className="w-full h-12 mt-2 rounded-xl bg-[#1ce4d2] hover:bg-[#129e91] text-slate-900 font-extrabold tracking-wide uppercase text-sm shadow-md transition-all active:scale-[0.98]"
              >
                Salvar Corrida
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* ========================================= */}
        {/* RESUMO DO DIA                             */}
        {/* ========================================= */}
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardContent className="pt-5 pb-5 px-5">
            <p className="text-sm font-extrabold text-slate-800 uppercase tracking-wide mb-4">Resumo de Hoje</p>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Total Ganho</p>
                <p className="text-xl font-extrabold text-[#129e91]">{formatarMoeda(totalHoje)}</p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">{corridasHoje.length} viagens</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">KM Rodado</p>
                <p className="text-xl font-extrabold text-slate-700">{kmHoje.toFixed(1)} <span className="text-sm">km</span></p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Percorridos</p>
              </div>
            </div>
            <WhatsAppShare
              lucroReal={totalHoje}
              kmRodado={kmHoje}
              valorHora={horasTrabalhadas > 0 ? totalHoje / horasTrabalhadas : 0}
            />
          </CardContent>
        </Card>

        {/* ========================================= */}
        {/* LISTA DE CORRIDAS DE HOJE                 */}
        {/* ========================================= */}
        {corridasHoje.length > 0 && (
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-3 pt-4 px-5">
              <CardTitle className="text-sm font-extrabold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                <Route className="size-4 text-[#1ce4d2]" strokeWidth={3} />
                Lançamentos do Dia
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="divide-y divide-slate-100">
                {corridasHoje.map((corrida) => (
                  <div key={corrida.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-600 border border-slate-200">
                        {corrida.plataforma}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{formatarMoeda(corrida.valorCorrida)}</p>
                        <p className="text-[11px] font-medium text-slate-500">{corrida.kmRodado} km percorridos</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveCorrida(String(corrida.id))}
                      className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg h-8 w-8 p-0 transition-colors"
                    >
                      <Trash2 className="size-4" strokeWidth={2} />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ========================================= */}
        {/* LISTA DE CORRIDAS ANTERIORES              */}
        {/* ========================================= */}
        {corridasAnteriores.length > 0 && (
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden opacity-90">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-3 pt-4 px-5">
              <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wide">Histórico Anterior</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="divide-y divide-slate-100">
                {corridasAnteriores.map((corrida) => (
                  <div key={corrida.id} className="flex items-center justify-between px-5 py-3 bg-white">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center rounded-lg bg-slate-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 border border-slate-100">
                        {corrida.plataforma}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-slate-600">{formatarMoeda(corrida.valorCorrida)}</p>
                        <p className="text-[11px] font-medium text-slate-400">{corrida.kmRodado} km &middot; {new Date(corrida.data).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveCorrida(String(corrida.id))}
                      className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg h-8 w-8 p-0 transition-colors"
                    >
                      <Trash2 className="size-4" strokeWidth={2} />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}