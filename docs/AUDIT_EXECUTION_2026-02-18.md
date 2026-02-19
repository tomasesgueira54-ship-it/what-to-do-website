# Auditoria de Website — Execução Real (2026-02-18)

## Escopo coberto
- UX e lógica do produto (navegação, eventos, subscribe, outbound, partners)
- Design e consistência funcional (CTAs, estados, feedback)
- Botões funcionais e APIs associadas
- Players, vídeo, som e assets de imagem
- Scrapers e qualidade/consistência de dados de eventos
- SEO, i18n e acessibilidade base

## Execução automatizada (evidência)

### 1) Baseline completo
- Comando: `npm run health`
- Resultado: **PASS**
  - `quality:events: OK`
  - `build: OK`
  - `audit (Playwright crawl): OK`
  - `subscribe-test: OK`
  - `image-opt: OK`

Observações:
- Crawl limitado por configuração: `MAX_PAGES=120`
- Cobertura parcial reportada: `Pages visited: 120`, `Remaining queued paths: 1166`

### 2) Scrapers e parsing
- Comando: `npm run test:parsing`
- Resultado: **PASS** (parsers base de datas/preços)

- Comando: `npm run test:detections`
- Resultado: **PASS** (deteção de categoria/género nos casos de teste)

- Comando: `npm run verify:events`
- Resultado: **PASS técnico de estrutura**, mas com **alerta de precisão de fonte**:
  - Dataset local: `621` eventos
  - `startDate` ISO válido: `621/621`
  - `endDate` ISO válido: `621/621`
  - `endDate >= startDate`: `621/621`
  - Preço presente: `606/621`
  - Morada presente: `592/621`
  - Localização presente: `621/621`
  - Verificação amostral de source:
    - `Price verification sample: matched 2/12`
    - `Date verification sample: matched 0/12`

## Validações runtime direcionadas (APIs/fluxos)

### 3) Partners (lead + export)
- POST `http://localhost:3001/api/promoters`
- Resultado: **201 Created**
  - `success: true`
  - `id: lead_...`

- GET `http://localhost:3001/api/partners/export?kind=leads&days=30`
- Resultado: **200 OK** (CSV disponível)

### 4) Outbound tracking + redirect
- GET `/api/outbound?target=...&eventId=test123&source=manual&locale=pt`
- Resultado: **302 Found**
- `Location` inclui UTM automático:
  - `utm_source=whattodo`
  - `utm_medium=referral`
  - `utm_campaign=event_test123`

## Achados por severidade

## 🔴 Alto impacto

1. **Precisão dos dados externos insuficiente na amostra**
   - Evidência: `verify:events` com `price matched 2/12` e `date matched 0/12`
   - Impacto: risco de mostrar data/preço divergente do promotor
   - Área: pipeline de scrapers e normalização

2. **Cobertura de auditoria de links incompleta por limite de crawl**
   - Evidência: `MAX_PAGES=120` com `1166` paths em fila
   - Impacto: links quebrados podem não ser detetados em produção

## 🟠 Médio impacto

3. **Experiência de áudio degradada por falta de fonte real nos episódios base**
   - Evidência de código: `data/episodes.ts` usa `audioUrl: ''` nos episódios
   - Impacto: player fica desativado/fallback “Sem fonte de áudio suportada”
   - Nota: comportamento está protegido tecnicamente, mas UX fica incompleta

4. **Subscribe persiste em memória apenas**
   - Evidência de código: `Set` in-memory em `app/api/subscribe/route.ts`
   - Impacto: duplicados e histórico perdem-se com restart/deploy

5. **Token de dashboard por querystring**
   - Evidência de código: `?token=` em `app/[locale]/partners/dashboard/page.tsx` e `/api/partners/export`
   - Impacto: risco de exposição via logs/referrer/histórico

## 🟡 Baixo impacto

6. **Sinais de placeholder editorial/mídia ainda presentes**
   - Ex.: links sociais genéricos no footer e dica de substituição manual de vídeo
   - Impacto: menor credibilidade percebida em ambiente público

7. **Warnings de análise em `.next/` não representam erro de fonte**
   - `get_errors` reporta muitos avisos em artefactos build (`.next`)
   - Impacto: ruído operacional se não houver exclusão desse diretório nas análises

## O que está bem implementado
- Pipeline de saúde automatizada funcional e útil para regressão rápida
- Validação de formulário com schema (`zod`) e feedback de erro/sucesso no UI
- Outbound tracking com validação de protocolo e append de UTM
- Estrutura i18n PT/EN consistente em rotas com prefixo
- Acessibilidade base com skip-link e `aria-*` em componentes críticos de formulário/player

## Ações recomendadas (ordem de execução)
1. **Dados/scrapers**
   - Aumentar validação de truth source por fornecedor (não só amostra global)
   - Adicionar regras de confiança por campo (date/price) e fallback explícito por source

2. **Cobertura de auditoria de links**
   - Subir `MAX_PAGES` em CI e adicionar priorização por rotas críticas + detalhe de evento

3. **Mídia real de podcast**
   - Preencher `audioUrl` reais ou ocultar CTA de reprodução quando indisponível

4. **Persistência de subscribe**
   - Migrar subscribers para Postgres (ou serviço de email list) com índice único por email

5. **Segurança operacional de dashboard**
   - Trocar token em query por header/cookie sessão curta (ou auth dedicada)

## Conclusão executiva
- O website está **estável tecnicamente** no baseline atual (build, crawl limitado, subscribe, imagens).
- O maior risco para experiência do utilizador não é renderização, mas sim **confiabilidade do dado de evento vindo de fontes externas**.
- A camada B2B (partners/dashboard/export) está funcional, porém com margem clara para reforço de segurança operacional e governança de dados.