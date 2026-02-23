"use client"

import { useState, useMemo, useCallback } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardHome } from "@/components/dashboard-home"
import { VehicleConfigCard } from "@/components/vehicle-config-card"
import { StewardshipWidget } from "@/components/stewardship-widget"
import { ScreenCorridas } from "@/components/screen-corridas"
import { ScreenRelatorios } from "@/components/screen-relatorios"
import { OnboardingModal } from "@/components/onboarding-modal"
import { useAuth } from "@/hooks/use-auth"
import type { VeiculoConfigDto, CorridaDto, MetaMordomiaDto, DadosDiariosDto } from "@/lib/types"
import {
  mockVeiculo,
  mockCorridas as initialCorridas,
  mockMetas,
  mockDadosSemanais,
  mockDadosMensais,
  mockCorridaDoDia,
} from "@/lib/mock-data"
import {
  calcularCustosOperacionais,
  calcularLucroReal,
} from "@/lib/dashboard-store"

const HEADER_MAP: Record<string, { title: string; subtitle?: string }> = {
  dashboard: { title: "LogosRoute" },
  corridas: { title: "Minhas Corridas", subtitle: "Registre suas entregas" },
  moto: { title: "Configurar Moto", subtitle: "Dados do veículo" },
  metas: { title: "Metas de Mordomia", subtitle: "Equilíbrio e saúde" },
  relatorios: { title: "Relatórios", subtitle: "Análise detalhada" },
}

export default function DashboardPage() {
  const auth = useAuth()
  
  const [activeSection, setActiveSection] = useState("dashboard")
  const [showOnboarding, setShowOnboarding] = useState(true)

  const [veiculo, setVeiculo] = useState<VeiculoConfigDto>(mockVeiculo)
  const [corridaDoDia] = useState(mockCorridaDoDia)
  const [metas, setMetas] = useState<MetaMordomiaDto>(mockMetas)
  const [corridas, setCorridas] = useState<CorridaDto[]>(initialCorridas)
  const [dadosSemanais, setDadosSemanais] = useState<DadosDiariosDto[]>(mockDadosSemanais)

  // ======================== CÁLCULOS ========================

  const custosOperacionais = useMemo(
    () =>
      calcularCustosOperacionais(
        corridaDoDia.kmRodado,
        veiculo.consumoMedioKmL,
        veiculo.precoLitroGasolina,
        veiculo.reservaManutencaoKm
      ),
    [corridaDoDia.kmRodado, veiculo]
  )

  const lucroReal = useMemo(
    () => calcularLucroReal(corridaDoDia.ganhoBruto, custosOperacionais),
    [corridaDoDia.ganhoBruto, custosOperacionais]
  )

  // ======================== HANDLERS ========================

  const handleVeiculoUpdate = useCallback(
    (newConfig: VeiculoConfigDto) => {
      setVeiculo(newConfig)
      const updatedWeekly = mockDadosSemanais.map((dia) => {
        const kmEstimado =
          dia.custoRodagem /
          (mockVeiculo.precoLitroGasolina / mockVeiculo.consumoMedioKmL +
            mockVeiculo.reservaManutencaoKm)
        const novoCusto =
          (kmEstimado / newConfig.consumoMedioKmL) * newConfig.precoLitroGasolina +
          kmEstimado * newConfig.reservaManutencaoKm
        return { ...dia, custoRodagem: parseFloat(novoCusto.toFixed(2)) }
      })
      setDadosSemanais(updatedWeekly)
    },
    []
  )

  const handleAddCorrida = useCallback(
    (c: Omit<CorridaDto, "id" | "motoristaId" | "criadoEm">) => {
      const newCorrida: CorridaDto = {
        ...c,
        id: Date.now(),
        motoristaId: auth.motorista?.id ?? 1,
        criadoEm: new Date().toISOString(),
      }
      setCorridas((prev) => [newCorrida, ...prev])
    },
    [auth.motorista]
  )

  const handleRemoveCorrida = useCallback((id: string | number) => {
    setCorridas((prev) => prev.filter((c) => String(c.id) !== String(id)))
  }, [])

  const handleUpdateMetas = useCallback((m: MetaMordomiaDto) => {
    setMetas(m)
  }, [])

  const handleLogout = useCallback(() => {
    auth.logout()
    // Opcional: Adicione um alert ou console.log aqui apenas para debugar se quiser
    console.log("Logout acionado (Redirecionamento desativado para testes)")
  }, [auth])

  const handleNavigate = useCallback(
    (id: string) => {
      if (id === "login") {
        handleLogout()
        return
      }
      setActiveSection(id)
    },
    [handleLogout]
  )

  // ======================== APP SHELL ========================

  const headerInfo = HEADER_MAP[activeSection] || HEADER_MAP.dashboard
  const nomeExibicao = auth.motorista?.nome || "Piloto de Testes" // Fallback para não quebrar a UI sem login

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        motoristaName={nomeExibicao}
      />

      {showOnboarding && (
        <OnboardingModal onClose={() => setShowOnboarding(false)} />
      )}

      <main className="lg:ml-[280px] min-h-screen pb-20 lg:pb-8">
        <div className="px-4 py-4 lg:px-8 lg:py-8 max-w-5xl mx-auto">
          <div className="flex flex-col gap-4">
            <DashboardHeader
              title={headerInfo.title}
              subtitle={headerInfo.subtitle}
              onLogout={handleLogout}
            />

            {activeSection === "dashboard" && (
              <DashboardHome
                lucroReal={lucroReal}
                ganhoBruto={corridaDoDia.ganhoBruto}
                custosOperacionais={custosOperacionais}
                kmRodado={corridaDoDia.kmRodado}
                horasTrabalhadas={corridaDoDia.horasTrabalhadas}
                motoristaName={nomeExibicao}
                dadosSemanais={dadosSemanais}
                dadosMensais={mockDadosMensais}
                onNavigate={handleNavigate}
              />
            )}

            {activeSection === "corridas" && (
              <ScreenCorridas
                corridas={corridas}
                onAddCorrida={handleAddCorrida}
                onRemoveCorrida={handleRemoveCorrida}
                horasTrabalhadas={corridaDoDia.horasTrabalhadas}
              />
            )}

            {activeSection === "moto" && (
              <div className="max-w-lg">
                <VehicleConfigCard veiculo={veiculo} onUpdate={handleVeiculoUpdate} />
              </div>
            )}

            {activeSection === "metas" && (
              <div className="max-w-xl">
                <StewardshipWidget
                  metas={metas}
                  editable
                  onUpdateMetas={handleUpdateMetas}
                />
              </div>
            )}

            {activeSection === "relatorios" && (
              <ScreenRelatorios
                dadosSemanais={dadosSemanais}
                dadosMensais={mockDadosMensais}
              />
            )}
          </div>
        </div>
      </main>

      <BottomNav active={activeSection} onNavigate={handleNavigate} />
    </div>
  )
}