// ======================================================================
// LogosRoute — Service Layer
// Cada funcao corresponde a um endpoint do backend C# .NET.
// Quando USE_MOCK = true, retornamos dados mock sem chamar a rede.
// ======================================================================

import { apiFetch } from "./api-config"
import type {
  LoginRequest,
  CadastroRequest,
  AuthResponse,
  MotoristaDto,
  VeiculoConfigDto,
  CriarCorridaRequest,
  CorridaDto,
  ResumoDiaDto,
  DadosDiariosDto,
  DadosMensaisDto,
  MetaMordomiaDto,
} from "./types"

// ======================== AUTH ========================

/** POST /api/auth/login */
export async function login(body: LoginRequest): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

/** POST /api/auth/cadastro */
export async function cadastro(body: CadastroRequest): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/cadastro", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

// ======================== MOTORISTA ========================

/** GET /api/motorista/me */
export async function getMotorista(): Promise<MotoristaDto> {
  return apiFetch<MotoristaDto>("/motorista/me")
}

// ======================== VEÍCULO ========================

/** GET /api/veiculo */
export async function getVeiculo(): Promise<VeiculoConfigDto> {
  return apiFetch<VeiculoConfigDto>("/veiculo")
}

/** PUT /api/veiculo */
export async function updateVeiculo(
  body: VeiculoConfigDto
): Promise<VeiculoConfigDto> {
  return apiFetch<VeiculoConfigDto>("/veiculo", {
    method: "PUT",
    body: JSON.stringify(body),
  })
}

// ======================== CORRIDAS ========================

/** GET /api/corridas */
export async function getCorridas(): Promise<CorridaDto[]> {
  return apiFetch<CorridaDto[]>("/corridas")
}

/** POST /api/corridas */
export async function criarCorrida(
  body: CriarCorridaRequest
): Promise<CorridaDto> {
  return apiFetch<CorridaDto>("/corridas", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

/** DELETE /api/corridas/{id} */
export async function deleteCorrida(id: number): Promise<void> {
  return apiFetch<void>(`/corridas/${id}`, { method: "DELETE" })
}

// ======================== DASHBOARD ========================

/** GET /api/dashboard/resumo-dia */
export async function getResumoDia(): Promise<ResumoDiaDto> {
  return apiFetch<ResumoDiaDto>("/dashboard/resumo-dia")
}

/** GET /api/dashboard/dados-semanais */
export async function getDadosSemanais(): Promise<DadosDiariosDto[]> {
  return apiFetch<DadosDiariosDto[]>("/dashboard/dados-semanais")
}

/** GET /api/dashboard/dados-mensais */
export async function getDadosMensais(): Promise<DadosMensaisDto[]> {
  return apiFetch<DadosMensaisDto[]>("/dashboard/dados-mensais")
}

// ======================== METAS DE MORDOMIA ========================

/** GET /api/metas */
export async function getMetas(): Promise<MetaMordomiaDto> {
  return apiFetch<MetaMordomiaDto>("/metas")
}

/** PUT /api/metas */
export async function updateMetas(
  body: MetaMordomiaDto
): Promise<MetaMordomiaDto> {
  return apiFetch<MetaMordomiaDto>("/metas", {
    method: "PUT",
    body: JSON.stringify(body),
  })
}
