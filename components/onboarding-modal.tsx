"use client"

import { useState, useEffect } from "react"
import { X, Fuel, DollarSign, MapPin, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

const ONBOARDING_KEY = "logosroute_onboarding_done"

interface OnboardingModalProps {
  onClose: () => void
}

export function OnboardingModal({ onClose }: OnboardingModalProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const done = localStorage.getItem(ONBOARDING_KEY)
    if (!done) {
      setVisible(true)
    }
  }, [])

  function handleDismiss() {
    localStorage.setItem(ONBOARDING_KEY, "true")
    setVisible(false)
    onClose()
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={handleDismiss}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-card rounded-2xl shadow-xl border border-border animate-in slide-in-from-bottom-4 fade-in duration-300"
        role="dialog"
        aria-modal="true"
        aria-label="Guia de Boas-Vindas"
      >
        {/* Close */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 size-8 flex items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Fechar"
        >
          <X className="size-4" />
        </button>

        <div className="p-6 pb-2 text-center">
          <div className="mx-auto size-14 rounded-2xl bg-primary flex items-center justify-center mb-4">
            <TrendingUp className="size-7 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Bem-vindo ao LogosRoute!
          </h2>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Veja como calcular seu <strong className="text-foreground">Lucro Real</strong> em 3 passos simples:
          </p>
        </div>

        <div className="px-6 py-4 flex flex-col gap-3">
          {/* Step 1 */}
          <div className="flex items-start gap-3 rounded-xl bg-secondary p-3.5">
            <div className="size-9 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
              <Fuel className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">1. Configure seu Consumo</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {"Em \"Configurar Moto\", informe quantos km/L sua moto faz."}
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 rounded-xl bg-secondary p-3.5">
            <div className="size-9 shrink-0 rounded-lg bg-accent/10 flex items-center justify-center">
              <DollarSign className="size-4 text-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">2. Atualize o Preço da Gasolina</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Coloque o valor real do litro no posto que você abastece.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 rounded-xl bg-secondary p-3.5">
            <div className="size-9 shrink-0 rounded-lg bg-blue-50 flex items-center justify-center">
              <MapPin className="size-4 text-chart-1" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">3. Registre seus KM Rodados</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                {"Em \"Minhas Corridas\", cadastre cada entrega com o valor e km."}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 pt-2">
          <Button
            onClick={handleDismiss}
            className="w-full h-13 rounded-xl text-base font-semibold bg-primary text-primary-foreground hover:bg-emerald-glow"
          >
            Entendi, vamos começar!
          </Button>
          <p className="text-[11px] text-muted-foreground text-center mt-3">
            Este guia aparece apenas uma vez.
          </p>
        </div>
      </div>
    </div>
  )
}
