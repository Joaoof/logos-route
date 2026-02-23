// ======================================================================
// LogosRoute — Dados Mock
// Usados quando USE_MOCK = true ou quando o backend esta offline.
// Os shapes correspondem exatamente aos DTOs do C# .NET.
// ======================================================================

import type {
  VeiculoConfigDto,
  CorridaDto,
  MetaMordomiaDto,
  DadosDiariosDto,
  DadosMensaisDto,
  ResumoDiaDto,
} from "./types"

// ======================== VEICULO ========================

export const mockVeiculo: VeiculoConfigDto = {
  modelo: "Honda CG 160 Titan",
  consumoMedioKmL: 40,
  precoLitroGasolina: 5.79,
  reservaManutencaoKm: 0.12,
}

// ======================== CORRIDAS ========================

export const mockCorridas: CorridaDto[] = [
  { id: 1, motoristaId: 1, data: "2026-02-23", valorCorrida: 18.5, kmRodado: 6.2, plataforma: "iFood", criadoEm: "2026-02-23T08:10:00Z" },
  { id: 2, motoristaId: 1, data: "2026-02-23", valorCorrida: 12.0, kmRodado: 3.8, plataforma: "99Food", criadoEm: "2026-02-23T08:35:00Z" },
  { id: 3, motoristaId: 1, data: "2026-02-23", valorCorrida: 22.0, kmRodado: 8.1, plataforma: "iFood", criadoEm: "2026-02-23T09:12:00Z" },
  { id: 4, motoristaId: 1, data: "2026-02-23", valorCorrida: 15.0, kmRodado: 5.4, plataforma: "Rappi", criadoEm: "2026-02-23T09:55:00Z" },
  { id: 5, motoristaId: 1, data: "2026-02-23", valorCorrida: 35.0, kmRodado: 12.3, plataforma: "iFood", criadoEm: "2026-02-23T10:40:00Z" },
  { id: 6, motoristaId: 1, data: "2026-02-23", valorCorrida: 9.5, kmRodado: 2.9, plataforma: "99Food", criadoEm: "2026-02-23T11:20:00Z" },
  { id: 7, motoristaId: 1, data: "2026-02-23", valorCorrida: 28.0, kmRodado: 9.7, plataforma: "iFood", criadoEm: "2026-02-23T12:05:00Z" },
  { id: 8, motoristaId: 1, data: "2026-02-23", valorCorrida: 42.0, kmRodado: 14.5, plataforma: "Rappi", criadoEm: "2026-02-23T13:15:00Z" },
  { id: 9, motoristaId: 1, data: "2026-02-23", valorCorrida: 19.5, kmRodado: 7.1, plataforma: "iFood", criadoEm: "2026-02-23T14:00:00Z" },
  { id: 10, motoristaId: 1, data: "2026-02-22", valorCorrida: 31.0, kmRodado: 10.8, plataforma: "iFood", criadoEm: "2026-02-22T09:00:00Z" },
  { id: 11, motoristaId: 1, data: "2026-02-22", valorCorrida: 14.0, kmRodado: 4.6, plataforma: "99Food", criadoEm: "2026-02-22T10:30:00Z" },
  { id: 12, motoristaId: 1, data: "2026-02-22", valorCorrida: 26.5, kmRodado: 9.2, plataforma: "Rappi", criadoEm: "2026-02-22T12:00:00Z" },
  { id: 13, motoristaId: 1, data: "2026-02-21", valorCorrida: 20.0, kmRodado: 6.8, plataforma: "iFood", criadoEm: "2026-02-21T08:00:00Z" },
  { id: 14, motoristaId: 1, data: "2026-02-21", valorCorrida: 38.0, kmRodado: 13.0, plataforma: "iFood", criadoEm: "2026-02-21T11:00:00Z" },
]

// ======================== METAS ========================

export const mockMetas: MetaMordomiaDto = {
  estudoTeoMinutos: 45,
  estudoTeoMeta: 90,
  descansoMinutos: 360,
  descansoMeta: 480,
}

// ======================== DADOS SEMANAIS ========================

export const mockDadosSemanais: DadosDiariosDto[] = [
  { dia: "Seg", faturamentoBruto: 245, custoRodagem: 38.2 },
  { dia: "Ter", faturamentoBruto: 312, custoRodagem: 47.5 },
  { dia: "Qua", faturamentoBruto: 198, custoRodagem: 31.1 },
  { dia: "Qui", faturamentoBruto: 356, custoRodagem: 52.8 },
  { dia: "Sex", faturamentoBruto: 402, custoRodagem: 61.3 },
  { dia: "Sab", faturamentoBruto: 287, custoRodagem: 43.6 },
  { dia: "Dom", faturamentoBruto: 165, custoRodagem: 25.9 },
]

// ======================== DADOS MENSAIS ========================

export const mockDadosMensais: DadosMensaisDto[] = [
  { semana: "Sem 1", faturamentoBruto: 1420, custoRodagem: 218, lucroLiquido: 1202 },
  { semana: "Sem 2", faturamentoBruto: 1680, custoRodagem: 256, lucroLiquido: 1424 },
  { semana: "Sem 3", faturamentoBruto: 1530, custoRodagem: 234, lucroLiquido: 1296 },
  { semana: "Sem 4", faturamentoBruto: 1965, custoRodagem: 300, lucroLiquido: 1665 },
]

// ======================== RESUMO DIA (mock calculado) ========================

export function buildMockResumoDia(
  veiculo: VeiculoConfigDto,
  corridas: CorridaDto[]
): ResumoDiaDto {
  const hoje = new Date().toISOString().split("T")[0]
  const corridasHoje = corridas.filter((c) => c.data === hoje)
  const ganhoBruto = corridasHoje.reduce((s, c) => s + c.valorCorrida, 0)
  const kmRodado = corridasHoje.reduce((s, c) => s + c.kmRodado, 0)
  const custoCombustivel =
    veiculo.consumoMedioKmL > 0
      ? (kmRodado / veiculo.consumoMedioKmL) * veiculo.precoLitroGasolina
      : 0
  const custoManutencao = kmRodado * veiculo.reservaManutencaoKm
  const custosOperacionais = custoCombustivel + custoManutencao

  return {
    ganhoBruto,
    custoCombustivel,
    custoManutencao,
    custosOperacionais,
    lucroReal: ganhoBruto - custosOperacionais,
    kmRodado,
    horasTrabalhadas: 8.5, // mock fixo
    totalCorridas: corridasHoje.length,
  }
}

/** Custo fixo diario (seguro, parcela, etc.) — mock */
export const CUSTO_FIXO_DIARIO = 85

/**
 * Resumo rapido do dia — shape legado usado no page.tsx.
 * Quando o backend estiver pronto, sera substituido por ResumoDiaDto.
 */
export const mockCorridaDoDia = {
  ganhoBruto: 287.5,
  kmRodado: 94.3,
  horasTrabalhadas: 8.5,
}
