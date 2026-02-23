"use client"

import {
  LayoutDashboard,
  Route,
  Bike,
  Target,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "dashboard", label: "Painel", icon: LayoutDashboard },
  { id: "corridas", label: "Corridas", icon: Route },
  { id: "moto", label: "Moto", icon: Bike },
  { id: "metas", label: "Metas", icon: Target },
  { id: "relatorios", label: "Relat.", icon: BarChart3 },
]

interface BottomNavProps {
  active: string
  onNavigate: (id: string) => void
}

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-card border-t border-border"
      role="navigation"
      aria-label="Menu principal"
    >
      <div className="flex items-stretch justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 transition-colors relative",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <span className="absolute top-0 inset-x-4 h-[3px] rounded-b-full bg-primary" />
              )}
              <Icon className={cn("size-5", isActive && "stroke-[2.5px]")} />
              <span className={cn(
                "text-[10px] leading-tight font-medium",
                isActive && "font-bold"
              )}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
      {/* iOS safe area */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
