# 🔍 AUDITORIA EXTENSIVA - What To Do Website

**Data:** 17 Fevereiro 2026  
**Tipo:** Auditoria de estado atual (pós-correções Must + Should)  
**Estado Geral:** ✅ App funcional | ⚠️ Backlog de qualidade de dados

## 🔗 Relatórios Relacionados

- Ver resumo executivo em `FINAL_REPORT.md`
- Ver estado técnico de implementação em `IMPLEMENTATION_STATUS.md`

---

## 📌 Resumo Executivo

A auditoria confirma que os principais problemas de arquitetura, navegação localizada, formulários e rotas críticas foram resolvidos. O principal foco pendente está na qualidade dos dados de eventos (especialmente `endDate` e localização genérica em parte das fontes).

---

## ✅ Itens Funcionais Validados

### Rotas e Navegação
- Arquitetura locale-prefixed funcional (`/pt/*`, `/en/*`).
- Rotas de detalhe localizadas presentes para eventos, blog e episódios.
- Páginas legais localizadas (`privacy`, `terms`) presentes.
- Navegação crítica verificada por smoke test (HTTP 200 nas rotas-alvo).

### Subscrição
- Formulário com validação de `name + email + gdprConsent`.
- API `POST /api/subscribe` validada para:
  - erro sem consentimento
  - erro sem nome
  - sucesso com payload válido
  - bloqueio de duplicados (`ALREADY_SUBSCRIBED`)

### Build e Diagnóstico
- `npm run build` com sucesso.
- Sem erros de diagnóstico no workspace após a implementação desta fase.

---

## 📊 Auditoria de Dados (events.json)

### Positivo
- **Duplicados:** 0
- **URLs faltando:** 0
- **Títulos vazios/curtos:** 0
- **Cobertura de imagem:** 100%

### Pontos Críticos de Qualidade
| Issue                             | Count | % Aproximado | Impacto |
| --------------------------------- | ----- | ------------ | ------- |
| Sem `endDate`                     | 225   | 90%          | Alto    |
| `price` ausente ou `"Check site"` | 15    | 6%           | Médio   |
| Localização genérica (`Portugal`) | 164   | 66%          | Alto    |

### Observação
Estes pontos não impedem a aplicação de funcionar, mas afetam qualidade de filtragem, ordenação e precisão de informação para o utilizador final.

---

## 🧭 Estado por Área

### Frontend
- ✅ Cards e links principais funcionais no fluxo localizado.
- ✅ Página inicial localizada com alvo de subscrição funcional.
- ✅ UX base consistente para PT/EN nas áreas principais.

### Backend/API
- ✅ `POST /api/subscribe` funcional e validado.
- ⚠️ Não há, nesta fase, API dedicada de busca/index para eventos (a listagem atual usa leitura de dados e filtros no cliente/SSR por página conforme implementação existente).

### i18n
- ✅ Estrutura funcional de locale routing e mensagens PT/EN.
- ⚠️ Ainda existe espaço para refino de cobertura editorial total em conteúdos dinâmicos.

---

## 🚧 Backlog Prioritário (Pós-Auditoria)

### Prioridade Alta
1. Melhorar extração de `endDate` nos scrapers com maior gap.
2. Refinar extração de localização para reduzir `Portugal` genérico.
3. Configurar `RESEND_API_KEY` em ambiente alvo para envio real de email.

### Prioridade Média
1. Reprocessar dataset após melhorias de scraper.
2. Atualizar métricas de qualidade em nova auditoria após refresh de dados.

### Prioridade Baixa
1. Melhorias adicionais de i18n editorial.
2. Observabilidade e métricas de erros na API de subscrição.

---

## ✅ Conclusão da Auditoria

A base funcional do website está sólida e validada para uso, com os problemas críticos de navegação e fluxo de subscrição resolvidos. O trabalho seguinte é predominantemente de qualidade de dados e operação de ambiente.

**Última atualização:** 17 Fev 2026
