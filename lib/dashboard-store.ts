// ======================================================================
// LogosRoute — Funcoes de Calculo Puras + Re-exports
// Este arquivo NAO contem mais dados mock nem interfaces.
// Os tipos agora vivem em lib/types.ts e os mocks em lib/mock-data.ts.
//
// Mantemos os re-exports para nao quebrar os imports existentes.
// ======================================================================

// Re-export de tipos (para manter compatibilidade com imports antigos)
export type {
  VeiculoConfigDto as VeiculoConfig,
  CorridaDto as Corrida,
  MetaMordomiaDto as MetaMordomia,
  DadosDiariosDto as DadosDiarios,
  DadosMensaisDto as DadosMensais,
  MotoristaDto as Motorista,
} from "./types"

// Re-export de mocks (para manter compatibilidade)
export {
  mockVeiculo as defaultVeiculo,
  mockCorridas,
  mockMetas as defaultMetaMordomia,
  mockCorridaDoDia as defaultCorridaDoDia,
  mockDadosSemanais,
  mockDadosMensais,
  CUSTO_FIXO_DIARIO as custoFixoDiario,
} from "./mock-data"

// ======================== FUNCOES DE CALCULO PURAS ========================

export function calcularCustoCombustivel(
  kmRodado: number,
  consumoMedioKmL: number,
  precoLitroGasolina: number
): number {
  if (consumoMedioKmL === 0) return 0
  return (kmRodado / consumoMedioKmL) * precoLitroGasolina
}

export function calcularCustoManutencao(
  kmRodado: number,
  reservaManutencaoKm: number
): number {
  return kmRodado * reservaManutencaoKm
}

export function calcularCustosOperacionais(
  kmRodado: number,
  consumoMedioKmL: number,
  precoLitroGasolina: number,
  reservaManutencaoKm: number
): number {
  return (
    calcularCustoCombustivel(kmRodado, consumoMedioKmL, precoLitroGasolina) +
    calcularCustoManutencao(kmRodado, reservaManutencaoKm)
  )
}

export function calcularLucroReal(
  ganhoBruto: number,
  custosOperacionais: number
): number {
  return ganhoBruto - custosOperacionais
}

// ======================== FORMATACAO ========================

export function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}
