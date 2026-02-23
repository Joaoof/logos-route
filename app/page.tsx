"use client"

import { useState, useMemo, useCallback } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardHome } from "@/components/dashboard-home"
import { VehicleConfigCard } from "@/components/vehicle-config-card"
import { StewardshipWidget } from "@/components/stewardship-widget"
import { ScreenLogin } from "@/components/screen-login"
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

const USE_API = process.env.NEXT_PUBLIC_USE_API === "true"

const HEADER_MAP: Record<string, { title: string; subtitle?: string }> = {
  dashboard: { title: "LogosRoute" },
  corridas: { title: "Minhas Corridas", subtitle: "Registre suas entregas" },
  moto: { title: "Configurar Moto", subtitle: "Dados do veiculo" },
  metas: { title: "Metas de Mordomia", subtitle: "Equilibrio e saude" },
  relatorios: { title: "Relatorios", subtitle: "Analise detalhada" },
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

  const handleApiLogin = useCallback(
    async (body: { email: string; senha: string }) => {
      await auth.login(body)
      setActiveSection("dashboard")
    },
    [auth]
  )

  const handleApiCadastro = useCallback(
    async (body: { nome: string; email: string; senha: string; cidade: string; appUtilizado: string }) => {
      await auth.cadastro(body)
      setActiveSection("dashboard")
    },
    [auth]
  )

  const handleMockCadastro = useCallback(
    (nome: string, cidade: string, appUtilizado: string) => {
      auth.loginMock(nome, cidade, appUtilizado)
      setActiveSection("dashboard")
    },
    [auth]
  )

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

  const handleNavigate = useCallback(
    (id: string) => {
      if (id === "login") {
        auth.logout()
      }
      setActiveSection(id)
    },
    [auth]
  )

  const handleLogout = useCallback(() => {
    auth.logout()
    setActiveSection("login")
  }, [auth])

  // ======================== LOGIN ========================

  if (!auth.isAuthenticated) {
    return (
      <ScreenLogin
        usarApi={USE_API}
        onLogin={handleApiLogin}
        onCadastro={handleApiCadastro}
        onCadastroMock={handleMockCadastro}
        isLoading={auth.isLoading}
        error={auth.error}
      />
    )
  }

  // ======================== APP SHELL ========================

  const headerInfo = HEADER_MAP[activeSection] || HEADER_MAP.dashboard

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar (hidden on mobile) */}
      <AppSidebar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        motoristaName={auth.motorista?.nome}
      />

      {showOnboarding && (
        <OnboardingModal onClose={() => setShowOnboarding(false)} />
      )}

      {/* Main content: no left margin on mobile, sidebar offset on desktop */}
      <main className="lg:ml-[280px] min-h-screen pb-20 lg:pb-8">
        <div className="px-4 py-4 lg:px-8 lg:py-8 max-w-5xl mx-auto">
          <div className="flex flex-col gap-4">
            {/* Header */}
            <DashboardHeader
              title={headerInfo.title}
              subtitle={headerInfo.subtitle}
              onLogout={handleLogout}
            />

            {/* ---- SCREENS ---- */}

            {activeSection === "dashboard" && (
              <DashboardHome
                lucroReal={lucroReal}
                ganhoBruto={corridaDoDia.ganhoBruto}
                custosOperacionais={custosOperacionais}
                kmRodado={corridaDoDia.kmRodado}
                horasTrabalhadas={corridaDoDia.horasTrabalhadas}
                motoristaName={auth.motorista?.nome}
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

      {/* Mobile bottom tab navigation */}
      <BottomNav active={activeSection} onNavigate={handleNavigate} />
    </div>
  )
}
