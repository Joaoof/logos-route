"use client"

import { Route, Bell, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  title: string
  subtitle?: string
  onLogout?: () => void
  showBack?: boolean
  onBack?: () => void
}

export function DashboardHeader({
  title,
  subtitle,
  onLogout,
}: DashboardHeaderProps) {
  const now = new Date()
  const dateStr = now.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  return (
    <header className="flex items-center justify-between">
      {/* Left: brand */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center size-9 rounded-xl bg-primary">
          <Route className="size-4.5 text-primary-foreground" />
        </div>
        <div className="min-w-0">
          <h1 className="text-base font-bold text-foreground leading-tight truncate">
            {title}
          </h1>
          <p className="text-[11px] text-muted-foreground capitalize leading-tight truncate">
            {subtitle || dateStr}
          </p>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="size-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary"
          aria-label="Notificacoes"
        >
          <Bell className="size-4.5" />
        </Button>
        {onLogout && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onLogout}
            className="size-9 rounded-xl text-muted-foreground hover:text-destructive hover:bg-secondary"
            aria-label="Sair"
          >
            <LogOut className="size-4.5" />
          </Button>
        )}
      </div>
    </header>
  )
}
