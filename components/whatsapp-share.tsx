"use client"

import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatarMoeda } from "@/lib/dashboard-store"

interface WhatsAppShareProps {
  lucroReal: number
  kmRodado: number
  valorHora: number
}

export function WhatsAppShare({ lucroReal, kmRodado, valorHora }: WhatsAppShareProps) {
  function handleShare() {
    const text = encodeURIComponent(
      `\u{1F4B0} Hoje o LogosRoute rendeu!\n` +
      `\u{2705} Lucro Real: ${formatarMoeda(lucroReal)}\n` +
      `\u{1F6E3}\u{FE0F} Rodados: ${kmRodado.toFixed(1)} km\n` +
      `\u{1F525} Minha hora valeu: ${formatarMoeda(valorHora)}/h\n` +
      `Fa\u{00E7}a sua mordomia valer tamb\u{00E9}m!`
    )
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer")
  }

  return (
    <Button
      onClick={handleShare}
      className="h-12 rounded-xl text-sm font-semibold bg-[#25D366] text-white hover:bg-[#1EBE5A] transition-colors w-full"
    >
      <Share2 className="size-4 mr-2" />
      Compartilhar no WhatsApp
    </Button>
  )
}
