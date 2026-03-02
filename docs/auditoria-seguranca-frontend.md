# Auditoria Completa de Segurança Front-End — LogosRoute

## Resumo executivo
Este documento foca em segurança de front-end para produção. O objetivo foi reduzir risco de:
- exposição indevida de sessão,
- abuso de superfície HTTP,
- XSS/clickjacking/mime sniffing,
- entrada malformada em fluxos críticos,
- inconsistências de ambiente que geram comportamento inseguro.

## Itens corrigidos neste ciclo

### 1) Headers de segurança no edge (alto)
**Risco anterior**: ausência de baseline de hardening HTTP (clickjacking, sniffing, policy de permissões e CSP).  
**Correção**: adicionados headers globais em `next.config.mjs`:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`
- `COOP` e `CORP`
- `Content-Security-Policy` (com diretivas de script/style/font/img/connect/object/frame/base/form).

### 2) Camada HTTP sem timeout / parsing inseguro (alto)
**Risco anterior**: `fetch` sem timeout, parse JSON assumido para qualquer retorno, risco de travamento e tratamento frágil de erros.  
**Correção**:
- timeout com `AbortController`;
- parser seguro por `content-type`;
- fallback seguro para erros não-JSON;
- `cache: no-store`, `Accept: application/json`, `referrerPolicy` explícita.

### 3) URL de API sem validação robusta (alto)
**Risco anterior**: URL de API aceita sem validação; em produção poderia operar em HTTP indevido.  
**Correção**:
- validação com `new URL()`;
- bloqueio de URL inválida;
- exigência de HTTPS em produção (exceto localhost).

### 4) Sessão sem bootstrap/validação ao iniciar app (alto)
**Risco anterior**: token armazenado sem verificação inicial do usuário -> risco de sessão inconsistente e estado quebrado.  
**Correção**:
- bootstrap de autenticação no `useAuth` com chamada a `/motorista/me`;
- remoção automática de token inválido/expirado;
- estado explícito `isBootstrapping`.

### 5) Validação de entrada fraca no auth (médio)
**Risco anterior**: payload enviado sem validação robusta de formato/limites.  
**Correção**:
- validação com `zod` (login/cadastro);
- trim, limites de tamanho e formato de e-mail;
- mensagens de erro seguras em UI (sem `alert`).

### 6) Melhorias de privacidade/segurança na UX de formulário (médio)
**Correção**:
- `autocomplete` apropriado para credenciais;
- `maxLength` para reduzir payload abusivo;
- feedback de erro com `role=alert`/`aria-live`.

## Riscos que ainda exigem backend (não resolvíveis só no front)

1. **Token em storage Web** (local/session) ainda é vulnerável a XSS caso exista injeção no app. O ideal é sessão com **cookie HttpOnly + SameSite + Secure** no backend.
2. **Rate limit / antifraude / lockout** devem existir no backend para login/cadastro.
3. **CSRF** deve ser tratado no backend caso migre para autenticação por cookie.
4. **Auditoria de autorização por recurso** (quem pode ver/editar o quê) é responsabilidade principal da API.

## Prioridade recomendada (próximo ciclo)
1. Migrar sessão para cookie HttpOnly e remover token do storage JS.
2. Reduzir dependência de `dangerouslySetInnerHTML` nas telas remanescentes.
3. Enrijecer CSP removendo `unsafe-inline` e `unsafe-eval` gradualmente.
4. Adicionar scanner SAST/Dependency audit no CI.

