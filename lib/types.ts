// ======================================================================
// LogosRoute — TypeScript DTOs
// Espelhados nos Models/DTOs do backend C# .NET
// Cada interface aqui corresponde a uma classe no namespace
// LogosRoute.Api.Models ou LogosRoute.Api.DTOs
// ======================================================================

// ======================== AUTH ========================

/** POST /api/auth/login — body */
export interface LoginRequest {
  email: string
  senha: string
}

/** POST /api/auth/cadastro — body */
export interface CadastroRequest {
  nome: string
  email: string
  senha: string
  cidade: string
  appUtilizado: string
}

/** Resposta de /api/auth/login e /api/auth/cadastro */
export interface AuthResponse {
  token: string
  motorista: MotoristaDto
}

// ======================== MOTORISTA ========================

/** GET /api/motorista/me */
export interface MotoristaDto {
  id: number
  nome: string
  email: string
  cidade: string
  appUtilizado: string
  criadoEm: string // ISO 8601
}

// ======================== VEÍCULO ========================

/** GET /api/veiculo  |  PUT /api/veiculo */
export interface VeiculoConfigDto {
  id?: number
  motoristaId?: number
  modelo: string
  consumoMedioKmL: number
  precoLitroGasolina: number
  reservaManutencaoKm: number
}

// ======================== CORRIDA ========================

/** POST /api/corridas — body */
export interface CriarCorridaRequest {
  data: string // "yyyy-MM-dd"
  valorCorrida: number
  kmRodado: number
  plataforma: string
}

/** GET /api/corridas  |  GET /api/corridas/{id} */
export interface CorridaDto {
  id: number
  motoristaId: number
  data: string
  valorCorrida: number
  kmRodado: number
  plataforma: string
  criadoEm: string
}

// ======================== DASHBOARD / RESUMO ========================

/** GET /api/dashboard/resumo-dia */
export interface ResumoDiaDto {
  ganhoBruto: number
  custoCombustivel: number
  custoManutencao: number
  custosOperacionais: number
  lucroReal: number
  kmRodado: number
  horasTrabalhadas: number
  totalCorridas: number
}

/** GET /api/dashboard/dados-semanais */
export interface DadosDiariosDto {
  dia: string // "Seg", "Ter", etc.
  faturamentoBruto: number
  custoRodagem: number
}

/** GET /api/dashboard/dados-mensais */
export interface DadosMensaisDto {
  semana: string // "Sem 1", "Sem 2", etc.
  faturamentoBruto: number
  custoRodagem: number
  lucroLiquido: number
}

// ======================== METAS DE MORDOMIA ========================

/** GET /api/metas  |  PUT /api/metas */
export interface MetaMordomiaDto {
  id?: number
  motoristaId?: number
  estudoTeoMinutos: number
  estudoTeoMeta: number
  descansoMinutos: number
  descansoMeta: number
}

// ======================== ERROR ========================

/**
 * Formato padrão de erro do ASP.NET Core (ProblemDetails - RFC 7807).
 * Todas as respostas 4xx/5xx do backend seguem este formato.
 */
export interface ProblemDetails {
  type?: string
  title: string
  status: number
  detail?: string
  errors?: Record<string, string[]>
}
