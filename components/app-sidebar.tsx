"use client"

import {
  LayoutDashboard,
  Route,
  Bike,
  Target,
  BarChart3,
  ChevronRight,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface NavItem {
  label: string
  icon: React.ReactNode
  id: string
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: <LayoutDashboard className="size-5" />, id: "dashboard" },
  { label: "Minhas Corridas", icon: <Route className="size-5" />, id: "corridas" },
  { label: "Configurar Moto", icon: <Bike className="size-5" />, id: "moto" },
  { label: "Metas de Mordomia", icon: <Target className="size-5" />, id: "metas" },
  { label: "Relatórios", icon: <BarChart3 className="size-5" />, id: "relatorios" },
]

interface AppSidebarProps {
  activeSection: string
  onNavigate: (id: string) => void
  motoristaName?: string
}

function NavList({
  activeSection,
  onNavigate,
}: {
  activeSection: string
  onNavigate: (id: string) => void
}) {
  return (
    <nav className="flex flex-col gap-1" role="navigation" aria-label="Menu principal">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={cn(
            "flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-150 min-h-[52px]",
            activeSection === item.id
              ? "bg-[var(--emerald-light)] text-primary font-semibold"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
        >
          <span
            className={cn(
              "flex items-center justify-center size-9 rounded-lg transition-colors",
              activeSection === item.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground"
            )}
          >
            {item.icon}
          </span>
          <span className="flex-1 text-left">{item.label}</span>
          {activeSection === item.id && (
            <ChevronRight className="size-4 text-primary" />
          )}
        </button>
      ))}
    </nav>
  )
}

function SidebarBrand() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center size-20 rounded-xl">
          <img src="logos.png" alt="" />
      </div>
      <div>
        <span className="text-lg font-bold tracking-tight text-foreground">
          LogosRoute
        </span>
        <p className="text-[11px] text-muted-foreground font-normal">
          Lucro Real do Motoboy
        </p>
      </div>
    </div>
  )
}

function SidebarFooter({
  motoristaName,
  onLogout,
}: {
  motoristaName?: string
  onLogout: () => void
}) {
  return (
    <div className="p-4 border-t border-border">
      {motoristaName && (
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
              {motoristaName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-foreground truncate max-w-[120px]">
              {motoristaName}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-muted-foreground hover:text-destructive h-9 w-9 p-0 rounded-lg"
            aria-label="Sair da conta"
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      )}
      <div className="rounded-xl bg-secondary p-3">
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {"v1.0.0 Beta \u2014 Dados simulados"}
        </p>
      </div>
    </div>
  )
}

export function AppSidebar({
  activeSection,
  onNavigate,
  motoristaName,
}: AppSidebarProps) {
  function handleNav(id: string) {
    onNavigate(id)
  }

  function handleLogout() {
    onNavigate("login")
  }

  return (
    <>
      {/* Desktop sidebar only — mobile uses BottomNav */}
      <aside className="hidden lg:flex lg:flex-col lg:w-[280px] lg:fixed lg:inset-y-0 lg:left-0 bg-card border-r border-border z-40">
        <div className="p-6 pb-2">
          <SidebarBrand />
        </div>
        <div className="flex-1 px-3 pt-6 overflow-y-auto">
          <NavList activeSection={activeSection} onNavigate={handleNav} />
        </div>
        <SidebarFooter
          motoristaName={motoristaName}
          onLogout={handleLogout}
        />
      </aside>
    </>
  )
}
