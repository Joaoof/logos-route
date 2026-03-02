# Auditoria Técnica de Front-End — LogosRoute

## Escopo e método
- Leitura estrutural do código (App Router, hooks, camada de API, componentes de tela e config de build).
- Validação de checks locais (`pnpm lint`, `pnpm build`) para medir maturidade de produção.
- Classificação de gravidade por impacto em produção + custo de correção.

---

## Resumo executivo (frio e direto)
O front-end está com **bom esforço visual** e uma base de componentes reutilizáveis, mas hoje opera com **risco alto para produção** por falhas de arquitetura de estado/auth, qualidade de tipagem, acessibilidade e robustez de build.

Os principais riscos não são cosméticos: há decisões que geram **comportamento inconsistente**, **degradação de UX**, **déficit de SEO/A11y** e **dívida técnica que escala mal**.

---

## Pontos positivos (com motivo técnico)
1. **Camada de API centralizada (`apiFetch`)**: boa decisão de encapsular token e tratamento de erro (`ApiError`) em uma única borda. Isso reduz duplicação e facilita observabilidade/retry no futuro.
2. **Uso consistente de DTOs**: apesar de problemas pontuais, a intenção de tipar contratos de backend está correta e ajuda a evitar acoplamento implícito.
3. **Uso de `useMemo`/`useCallback` em partes críticas da página principal**: há tentativa explícita de controlar derivação e handlers, o que é melhor do que renderização totalmente ingênua.
4. **Estratégia PWA já ligada no build**: para o contexto de uso “na rua”, cache offline é uma direção arquitetural válida.

---

## Achados por severidade

### 🔴 Crítico

#### 1) Estado de autenticação não é global/persistido corretamente
**Evidência**: `useAuth` mantém estado local em `useState` sem provider/context; cada tela instancia seu próprio estado. Login em `/login` não compartilha sessão com `/` além de possível token em storage, e sequer existe bootstrap de usuário por token.  
**Risco**: fluxo de autenticação inconsistente, “login fantasma”, perda de sessão ao navegar/recarregar, bugs difíceis de reproduzir.  
**Correção concreta**:
- Implementar `AuthProvider` (React Context + reducer) no `app/layout.tsx`.
- No mount, validar token e hidratar `motorista` via `/motorista/me`.
- Expor `useAuth()` apenas como consumo de contexto (não como estado isolado).
**Alternativa arquitetural melhor**:
- Migrar para sessão server-driven (Next middleware + cookies HttpOnly + validação SSR).
**Impacto esperado**: previsibilidade de sessão, menor risco de bugs críticos de acesso e base pronta para autorização por plano.

#### 2) Configuração de TypeScript e build mascarando problemas reais
**Evidência**: `ignoreBuildErrors: true` no Next config permite deploy com erro de tipagem.  
**Risco**: regressões silenciosas chegando em produção, especialmente em pontos financeiros/autenticação.  
**Correção concreta**:
- Remover `ignoreBuildErrors: true`.
- Adicionar `pnpm typecheck` no CI e bloquear merge com erro.
**Alternativa arquitetural melhor**:
- Pipeline com gates: lint + typecheck + build + smoke test.
**Impacto esperado**: prevenção de bugs antes de produção e redução de custo de correção tardia.

#### 3) Contrato de tipos inconsistente (duplicação/confito de interface)
**Evidência**: `MotoristaDto` é declarado duas vezes com estruturas diferentes no mesmo arquivo.  
**Risco**: ambiguidade de tipo, comportamento imprevisível do TS, bugs de integração backend/frontend.  
**Correção concreta**:
- Manter apenas uma definição canônica de `MotoristaDto`.
- Criar versões explícitas se necessário (`MotoristaBaseDto`, `MotoristaPlanoDto`) com composição.
**Alternativa arquitetural melhor**:
- Tipos gerados via OpenAPI (codegen) para eliminar drift manual.
**Impacto esperado**: contrato estável e menor chance de quebra em evolução de API.

---

### 🟠 Alto

#### 4) Estratégia de imagem e assets não otimizada
**Evidência**: uso repetido de `<img src="logos.png" alt="" />` e `images.unoptimized: true`.  
**Risco**: pior LCP, ausência de otimizações automáticas, custo de banda maior em rede móvel.  
**Correção concreta**:
- Migrar para `<Image />` do Next com dimensões explícitas.
- Remover `unoptimized: true` salvo necessidade técnica comprovada.
**Alternativa arquitetural melhor**:
- Pipeline de imagem (AVIF/WebP + placeholders + tamanhos responsivos).
**Impacto esperado**: ganho de performance real (Core Web Vitals), UX melhor em dispositivos de baixa conectividade.

#### 5) Injeção de CSS e import de fontes dentro de componentes
**Evidência**: múltiplos componentes usando `<style dangerouslySetInnerHTML>` com `@import` de Google Fonts.  
**Risco**: custo de renderização duplicado, bloqueio de render, inconsistência visual e superfície de risco desnecessária.  
**Correção concreta**:
- Centralizar fontes via `next/font` em layout/theme.
- Remover imports dinâmicos repetidos de cada tela.
**Alternativa arquitetural melhor**:
- Design system com tokens tipográficos únicos no tema global.
**Impacto esperado**: CSS mais previsível, menos overhead em runtime, melhor manutenção.

#### 6) Acessibilidade básica comprometida (inputs sem label explícita, botões icônicos sem nome)
**Evidência**: campos de formulário baseados em placeholder e vários botões sem `aria-label` em ações críticas (ex.: fechar modal, remover item).  
**Risco**: navegação ruim para leitor de tela/teclado, risco legal e de exclusão de usuários.  
**Correção concreta**:
- Associar `<label htmlFor>` e `id` em todos os inputs.
- Garantir `aria-label` descritivo em botões apenas com ícone.
- Adicionar foco visível consistente e testes com teclado.
**Alternativa arquitetural melhor**:
- Checklists A11y no PR + testes automatizados (axe/playwright).
**Impacto esperado**: conformidade mínima WCAG e UX universal melhor.

#### 7) Flag de ambiente e lógica de mock confusas
**Evidência**: páginas usam `NEXT_PUBLIC_USE_API` com semântica invertida entre login/cadastro; `USE_MOCK` em config mistura presença de `window` com URL.  
**Risco**: comportamento diferente por tela/ambiente, bugs intermitentes em QA/prod.  
**Correção concreta**:
- Definir uma única matriz de ambientes (`MODE=mock|api`).
- Eliminar ternários implícitos e inversões semânticas.
**Alternativa arquitetural melhor**:
- Arquivo de configuração tipado por ambiente e validação em startup.
**Impacto esperado**: previsibilidade operacional e menos custo de suporte.

---

### 🟡 Médio

#### 8) Página principal monolítica e acoplada
**Evidência**: `app/page.tsx` concentra estado, regras de negócio, navegação e composição de múltiplas telas.  
**Risco**: queda de escalabilidade, maior chance de regressão em mudanças simples.  
**Correção concreta**:
- Extrair feature modules (`dashboard`, `corridas`, `relatorios`) com hooks dedicados.
- Separar estado de domínio (corridas, metas, veículo) em store/context por feature.
**Alternativa arquitetural melhor**:
- Arquitetura por fatias (feature-first) + containers/presentational.
**Impacto esperado**: codebase mais evolutiva e onboarding técnico mais rápido.

#### 9) Renderização de listas sem virtualização / sem paginação
**Evidência**: listas de corridas são renderizadas integralmente e manipuladas na memória local.  
**Risco**: degradação em aparelhos modestos quando volume crescer.  
**Correção concreta**:
- Paginar dados e virtualizar lista quando ultrapassar limiar.
**Alternativa arquitetural melhor**:
- Fetch incremental (cursor/infinite query) com cache.
**Impacto esperado**: estabilidade de FPS e menor consumo de memória.

#### 10) Falta de estados vazios/erro carregamento padronizados
**Evidência**: muitas telas assumem presença de dados mock e não exibem estratégia clara para erro/vazio/loading além de pontos isolados.  
**Risco**: UX fraca em condições reais de rede/erro.  
**Correção concreta**:
- Componente padrão de estados (`LoadingState`, `ErrorState`, `EmptyState`) por feature.
**Alternativa arquitetural melhor**:
- Data-fetching com camada de query (SWR/TanStack Query).
**Impacto esperado**: UX resiliente e consistente.

#### 11) SEO limitado por app excessivamente client-side
**Evidência**: `app/page.tsx` é totalmente `"use client"`; conteúdo primário é renderizado no cliente.  
**Risco**: menor indexabilidade e pior tempo de conteúdo para bots e conexões lentas.  
**Correção concreta**:
- Manter shell server component e mover interatividade para ilhas client.
**Alternativa arquitetural melhor**:
- SSR/ISR para conteúdo estável e hidratação seletiva.
**Impacto esperado**: melhor SEO técnico e percepção de performance.

---

### 🟢 Baixo

#### 12) Inconsistências de nomenclatura/idioma e ruído de comentários
**Evidência**: mistura de português/inglês, comentários “temporários” e variáveis não utilizadas (ex.: `metas`, `acessoBloqueado`, `handleUpdateMetas`).  
**Risco**: dívida cognitiva e leitura mais lenta do código.  
**Correção concreta**:
- Padronizar convenções de idioma e remover código morto.
**Alternativa arquitetural melhor**:
- ESLint rules para unused vars + convention docs.
**Impacto esperado**: melhor legibilidade e menor atrito de manutenção.

#### 13) Duplicação de hook utilitário
**Evidência**: `useIsMobile` existe em dois locais com o mesmo código.  
**Risco**: divergência futura e manutenção duplicada.  
**Correção concreta**:
- Manter implementação única e reexportar se necessário.
**Alternativa arquitetural melhor**:
- Pacote interno de utilitários UI compartilhados.
**Impacto esperado**: menor superfície de inconsistência.

---

## Gargalos estratégicos e custos de oportunidade
1. **Arquitetura centrada em mock** está atrasando validação de cenário real (erro, latência, sessão). Custo: ilusão de progresso visual sem robustez operacional.
2. **Foco em styling avançado antes de fundamentos de A11y/performance** aumenta retrabalho quando o produto escalar.
3. **Sem pipeline de qualidade efetivo** (lint/typecheck confiáveis), o time paga juros altos em bugs de integração.

---

## Roadmap de correção recomendado (ordem de execução)
1. **Semana 1**: corrigir autenticação global + contrato de tipos + remover `ignoreBuildErrors`.
2. **Semana 2**: centralizar fonte/estilo global e normalizar A11y de formulários/ações.
3. **Semana 3**: refator feature modules + estados de loading/erro/vazio + paginação de corridas.
4. **Semana 4**: otimização de imagens, revisão de bundle/cache e baseline de métricas (LCP/INP/CLS).

---

## Checks executados
- `pnpm lint`: falhou por ausência de `eslint.config.*` (setup incompleto com ESLint v9).
- `pnpm build`: falhou ao buscar fontes Google (`next/font`) no ambiente atual.

