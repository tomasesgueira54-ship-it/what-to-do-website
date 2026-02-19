<!-- markdownlint-disable -->

# Partners Dashboard — Guia Completo de Acesso e Controlo

**Data**: 18 de Fevereiro de 2026  
**Aplicação**: What To Do Lisbon  
**Status**: Implementado e Validado  
**Versão**: 1.0.0

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura de Acesso](#estrutura-de-acesso)
3. [Recursos Públicos](#recursos-públicos)
4. [Dashboard Interno (Protegido)](#dashboard-interno-protegido)
5. [Dados Persistidos](#dados-persistidos)
6. [Filtros e Ordenação](#filtros-e-ordenação)
7. [Controlo de Acesso](#controlo-de-acesso)
8. [Guia de Utilizador](#guia-de-utilizador)
9. [Variáveis de Ambiente](#variáveis-de-ambiente)
10. [Endpoints API](#endpoints-api)

---

## 🎯 Visão Geral

O **Partners Dashboard** é uma plataforma integrada para monitorizar, analisar e gerir dados de parcerias:

- **Atração de Leads**: Formulário público para potenciais parceiros
- **Rastreamento de Cliques**: Monitoriza cliques em links de eventos
- **Análise de Desempenho**: Comparações período-a-período
- **Ordenação Avançada**: Tabelas interativas com filtros e sort
- **Exportação de Dados**: CSV para 15 primeiros leads/cliques

**Tecnologia**: Next.js 16, React 18, PostgreSQL (opcional), Tailwind CSS

---

## 🔐 Estrutura de Acesso

```
┌─────────────────────────────────────────────────────────┐
│              PÚBLICOS (Sem Autenticação)                │
├─────────────────────────────────────────────────────────┤
│ • Landing Page: /pt/partners, /en/partners              │
│ • Lead Form: Submissão pública                          │
│ • Event Links: Rastreamento de cliques públicos        │
└─────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────┐
│           DADOS RECOLHIDOS (BD + Memória)              │
├─────────────────────────────────────────────────────────┤
│ • wtd_outbound_clicks: Cliques em eventos              │
│ • wtd_promoter_leads: Informações de parceiros         │
└─────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────┐
│        DASHBOARD (Protegido com Token Secreto)          │
├─────────────────────────────────────────────────────────┤
│ • /pt/partners/dashboard?token=xxx                      │
│ • /en/partners/dashboard?token=xxx                      │
│ • Métricas, gráficos, tabelas, exportação              │
└─────────────────────────────────────────────────────────┘
```

---

## 📖 Recursos Públicos

### Landing Page de Parcerias

**URL**: 
- `https://seu-app.com/pt/partners`
- `https://seu-app.com/en/partners`

**Quem Vê**: Qualquer pessoa (sem login)

**O Que Contém**:
- Descrição de oportunidades de parceria
- Cards com categorias (Eventos, Guias Privados, Transfers, Marca)
- Formulário de interesse com campos:
  - Nome, Email, Empresa/Marca
  - Website (opcional)
  - Categoria de interesse
  - Budget estimado
  - Mensagem pessoal
  - Idioma (PT ou EN)

**Ação**: Ao clicar "Enviar Pedido", os dados são:
1. Validados no frontend
2. Enviados para `/api/promoters`
3. Rate-limitados + validados no backend
4. Guardados em PostgreSQL ou memória
5. Confirmação ao utilizador

---

### Links de Eventos com Rastreamento

**URL**: `/pt/events/[id]` ou `/en/events/[id]`

**Botão**: "Compre" / "Buy" → Redireciona através de `/api/outbound`

**O Que Acontece**:
1. Utilizador clica no botão de compra
2. Sistema recolhe:
   - Event ID
   - Source (organic, paid, email, etc.)
   - Locale (pt, en)
   - Target Host + Path
   - User Agent + IP
   - Referrer
3. Dados guardados em BD
4. Redireciona para plataforma de tickets (ex: Eventbrite)
5. Add UTM parameters automaticamente

---

## 🛡️ Dashboard Interno (Protegido)

### Acesso ao Dashboard

**URL Base**:
```
https://seu-app.com/pt/partners/dashboard?token=SEU_TOKEN_SECRETO
https://seu-app.com/en/partners/dashboard?token=SEU_TOKEN_SECRETO
```

**Autenticação**:
- Variável `.env.local`: `PARTNERS_DASHBOARD_TOKEN=seu_token_muito_secreto`
- Se não estiver definida → dashboard acessível publicamente (não recomendado em produção)
- Se estiver definida → requer token correto no URL

**Sem Token Correto**: Mensagem "Dashboard protegido - Fornece o token correto no URL"

---

### Secções do Dashboard

#### 1️⃣ **Cards de Métricas (Topo)**

| Card                 | Dado                  | Comparação                  |
| -------------------- | --------------------- | --------------------------- |
| **Total de Cliques** | Cliques totais        | vs período anterior (Δ ± %) |
| **Total de Leads**   | Leads recebidos       | vs período anterior (Δ ± %) |
| **Persistência**     | PostgreSQL ou Memória | Tipo de armazenamento       |
| **Conversão**        | Leads / Cliques (%)   | vs período anterior (Δ pp)  |

**Cores**:
- 🟢 Verde (+): Crescimento
- 🔴 Vermelho (-): Queda
- ⚪ Cinzento (—): Sem histórico

---

#### 2️⃣ **Período de Análise**

**Botões**: 7d | 30d | 90d (padrão: 30d)

**Efeito**: Recarrega dashboard com novo período

---

#### 3️⃣ **Filtros Avançados**

```
┌─────────────────────────────────┐
│ Todas as Fontes    │ Dropdown   │
│ Todos os Eventos   │ Dropdown   │
│ [Aplicar Filtros]  [Limpar]     │
└─────────────────────────────────┘
```

**Fonte**: Ex. "organic", "paid", "email", "newsletter"  
**Evento**: Ex. "lisbon-2024", "porto-summer-2026"

---

#### 4️⃣ **Top Fontes (Esquerda)**

Lista dos 8 principais canais de tráfego com cliques totais.

**Formato**:
```
organic       ▪ 1,245
paid          ▪ 876
email         ▪ 432
newsletter    ▪ 298
```

---

#### 5️⃣ **Top Eventos (Direita)**

Lista dos 8 eventos mais clicados.

**Formato**:
```
lisbon-2024           ▪ 1,567
porto-jazz-2026       ▪ 891
masterclass-feb       ▪ 456
```

---

#### 6️⃣ **Ganhos/Perdas por Fonte (Tabela Interativa)**

**Colunas Ordenáveis**:

| Fonte   | Atual | Anterior | Delta             |
| ------- | ----- | -------- | ----------------- |
| organic | 1,245 | 998      | **+247 (+24.7%)** |
| paid    | 876   | 1,102    | **−226 (−20.5%)** |
| email   | 432   | 389      | **+43 (+11.1%)**  |

**Ordenação por Header**:
- **Fonte**: A → Z
- **Atual**: ↓ Maior → Menor (padrão ↓)
- **Anterior**: ↓ Maior → Menor
- **Delta**: ↓ Maiores Aumentos (padrão)

**Indicadores**: ↑ Ascendente | ↓ Descendente

**Cores Delta**:
- 🟢 Verde: Crescimento
- 🔴 Vermelho: Queda
- ⚪ Cinzento: Novo (sem histórico)

---

#### 7️⃣ **Gráfico Diário (Dual-Bar)**

**Visualização**: 7/30/90 barras conforme período

**Tipos de Barra** (lado-a-lado por dia):
- 🔴 Vermelho: Período atual
- ⚫ Cinzento escuro: Período anterior

**Dados por Barra**:
```
02-10  │ Atual / Anterior
       │ (por ex. 45/32)
       │ MM-DD para dia
```

**Interação**: Hover mostra `DD-MM: N cliques`

---

#### 8️⃣ **Leads Recentes**

**Tabela** com últimos 20 leads:

| Data  | Nome        | Email        | Empresa      | Categoria |
| ----- | ----------- | ------------ | ------------ | --------- |
| 18/02 | João Silva  | joao@ex.com  | Silva Events | Eventos   |
| 17/02 | Maria Costa | maria@ex.com | Costa Tours  | Transfers |

**Formato de Data**: Localizado (PT: DD/MM/YYYY, EN: MM/DD/YYYY)

---

#### 9️⃣ **Botões de Exportação (Topo-Direita)**

- **Exportar Leads CSV**: Todos os leads (filtrados)
- **Exportar Cliques CSV**: Todos os cliques (filtrados)
- **Voltar a Parcerias**: Link para landing page

---

## 💾 Dados Persistidos

### Base de Dados: PostgreSQL (Opcional)

Se `DATABASE_URL` está definida em `.env.local`:

#### Tabela 1: `wtd_outbound_clicks`

```sql
CREATE TABLE wtd_outbound_clicks (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  event_id TEXT NOT NULL,
  source TEXT NOT NULL,
  locale TEXT NOT NULL,
  target_host TEXT NOT NULL,
  target_path TEXT NOT NULL,
  referrer TEXT NOT NULL,
  user_agent TEXT NOT NULL,
  client_ip TEXT NOT NULL
);
```

**Exemplo de Registo**:
```
id: 1001
created_at: 2026-02-18T14:30:45.123Z
event_id: lisbon-2024
source: organic
locale: pt
target_host: eventbrite.com
target_path: /events/123456
referrer: whatodolisbon.com
user_agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)...
client_ip: 192.168.1.100
```

---

#### Tabela 2: `wtd_promoter_leads`

```sql
CREATE TABLE wtd_promoter_leads (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  category TEXT NOT NULL,
  budget TEXT NOT NULL,
  message TEXT NOT NULL,
  website TEXT,
  locale TEXT NOT NULL
);
```

**Exemplo de Registo**:
```
id: lead-123456
created_at: 2026-02-18T10:15:30.000Z
name: João Silva
email: joao@eventos.pt
company: Silva Events
category: events
budget: 500_2000
message: Queremos parceria para eventos corporativos
website: https://silva-events.pt
locale: pt
```

---

### Fallback: Memória (Sem BD)

Se `DATABASE_URL` não está definida:
- Dados guardados em arrays JavaScript
- ⚠️ **Perdidos ao reiniciar o servidor**
- Útil para desenvolvimento/testes
- Não recomendado para produção

---

## 🔄 Filtros e Ordenação

### Parâmetros de URL

```
?days=30&source=organic&eventId=lisbon-2024&sortBy=delta&sortDir=desc&token=abc123
```

| Parâmetro | Opções                           | Padrão        | Descrição             |
| --------- | -------------------------------- | ------------- | --------------------- |
| `days`    | 7, 30, 90                        | 30            | Período em dias       |
| `source`  | string                           | (todos)       | Filtra por canal      |
| `eventId` | string                           | (todos)       | Filtra por evento     |
| `sortBy`  | delta, current, previous, source | delta         | Coluna de ordenação   |
| `sortDir` | asc, desc                        | desc          | Direção               |
| `token`   | string                           | (obrigatório) | Token de autenticação |

### Exemplos de URLs

**Padrão (30 dias, ordenado por delta descendente)**:
```
/pt/partners/dashboard?token=mytoken123&days=30&sortBy=delta&sortDir=desc
```

**Últimos 7 dias, apenas fonte "organic"**:
```
/pt/partners/dashboard?token=mytoken123&days=7&source=organic&sortBy=delta&sortDir=desc
```

**Evento específico, ordenado por fonte A-Z**:
```
/pt/partners/dashboard?token=mytoken123&eventId=lisbon-2024&sortBy=source&sortDir=asc
```

**Últimos 90 dias, ordenado por cliques atuais (descendente)**:
```
/pt/partners/dashboard?token=mytoken123&days=90&sortBy=current&sortDir=desc
```

---

## 🔐 Controlo de Acesso

### Proteções Implementadas

#### 1. Dashboard Token

**Como Funciona**:
1. Definir em `.env.local`:
   ```
   PARTNERS_DASHBOARD_TOKEN=seu_token_super_secreto_muito_longo
   ```
2. Aceder ao dashboard com token no URL:
   ```
   https://seu-app.com/pt/partners/dashboard?token=seu_token_super_secreto_muito_longo
   ```
3. Token incorreto/ausente → erro de autenticação

**Recomendações**:
- Mínimo 32 caracteres aleatórios
- Usar `openssl rand -hex 16` para gerar
- Nunca comitir em Git (usar `.env.local`)
- Rotar regularmente em produção

#### 2. Rate Limiting (Lead Capture)

**Endpoint**: `/api/promoters`

**Limitações**:
- Máx 5 submissões por IP por 15 minutos
- Validação de email (RFC 5322)
- Validação de campos obrigatórios

---

#### 3. Origin Checking (Lead Capture)

**Validação**: O formulário só aceitará submissões da mesma origem

---

#### 4. Environment-Based Access

| Ambiente    | Dashboard Público? | Requer Token?            |
| ----------- | ------------------ | ------------------------ |
| Development | Sim                | Não (a menos que defina) |
| Staging     | Não                | Sim                      |
| Production  | Não                | Sim (obrigatório)        |

---

## 👤 Guia de Utilizador

### Para Parceiros Potenciais

1. **Aceder à Landing**: `https://seu-app.com/pt/partners`
2. **Preencher Formulário**:
   - Nome completo
   - Email profissional
   - Empresa/Marca
   - Website (opcional)
   - Categoria de interesse
   - Budget estimado
   - Mensagem personalizada
3. **Enviar**: Clica "Enviar Pedido"
4. **Confirmação**: "Pedido enviado com sucesso. Vamos contactar-te em breve."
5. **Esperar**: Follow-up por email

---

### Para Managers/Admin

1. **Aceder ao Dashboard**:
   - Bookmarcar: `https://seu-app.com/pt/partners/dashboard?token=ABC123&days=30`
   
2. **Análise Rápida**:
   - Ver cards de topo para KPIs principais
   - Comparar com período anterior
   
3. **Investigar Oportunidades**:
   - Ver tabela "Ganhos/Perdas por Fonte"
   - Ordenar por Delta para maiores movimentações
   - Filtrar por período/fonte/evento se necessário
   
4. **Follow-up**:
   - Exportar Leads CSV
   - Carregar em CRM
   - Realizar outreach
   
5. **Otimizar Canais**:
   - Ordenar por Fonte A-Z
   - Ver quais canais crescem/caem
   - Reajustar budget de marketing

---

## ⚙️ Variáveis de Ambiente

### Configuração Necessária

Criar ficheiro `.env.local` na raiz do projeto:

```bash
# Base de Dados (Opcional)
DATABASE_URL=postgresql://user:password@host:5432/whatodo
POSTGRES_SSL=disable  # ou 'require' em produção

# Autenticação Dashboard
PARTNERS_DASHBOARD_TOKEN=seu_token_super_secreto_muito_longo_minimo_32_chars

# Verificar que estas existem (do projeto)
NEXT_PUBLIC_SITE_URL=https://seu-app.com
```

### Validação

Após definir `.env.local`:

```bash
npm run build  # Vai validar se está tudo OK
npm run dev    # Aceder a /pt/partners/dashboard?token=...
```

---

## 🔌 Endpoints API

### 1. POST `/api/promoters`

**Submeter Lead de Parceria**

**Request**:
```json
{
  "name": "João Silva",
  "email": "joao@eventos.pt",
  "company": "Silva Events",
  "category": "events",
  "budget": "500_2000",
  "message": "Queremos parceria...",
  "website": "https://silva-events.pt",
  "locale": "pt"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Lead recorded successfully"
}
```

**Response (429)** — Rate Limit:
```json
{
  "error": "Too many requests from this IP"
}
```

**Response (400)** — Validação:
```json
{
  "error": "Invalid email format"
}
```

---

### 2. GET `/api/outbound`

**Rastrear Clique + Redirecionar**

**Query Params**:
```
?eventId=lisbon-2024
&source=organic
&locale=pt
&targetHost=eventbrite.com
&targetPath=/events/123456
&referrer=whatodolisbon.com
&utmSource=partners
&utmMedium=referral
```

**Response (302 Redirect)**:
```
Location: https://eventbrite.com/events/123456?utm_source=partners&utm_medium=referral...
```

---

### 3. GET `/api/partners/export`

**Exportar CSV**

**Query Params**:
```
?kind=leads  # ou 'clicks'
&days=30
&source=organic
&eventId=lisbon-2024
&token=abc123
```

**Response (200)**: CSV file download
```
id,createdAt,name,email,company,category,budget,message,website,locale
lead-1,2026-02-18,...
```

---

## 📊 Exemplo de Análise

### Cenário: Optimizar Budget de Marketing

**Segunda-feira, 10am**:

1. **Aceder Dashboard**
   ```
   /pt/partners/dashboard?token=abc123&days=30&sortBy=delta&sortDir=desc
   ```

2. **Ver Cards**
   - Cliques: 1,245 (+12%)
   - Leads: 87 (−5%)
   - Conversão: 6.98% (−0.5pp)

3. **Análise de Fontes**
   - "organic" cresceu +24.7% ✅
   - "paid" caiu −20.5% ⚠️
   - "email" cresceu +11.1% ✅

4. **Ação**
   - Aumentar esforços em "organic" (blog, SEO)
   - Revisar "paid" (GA, CPL muito alto?)
   - Manter "email" (bom ROI)

5. **Exportar Leads**
   - Clica "Exportar Leads CSV"
   - Carrega em Salesforce
   - Atribui follow-up ao team

6. **Alert**
   - Conversão caiu: Investigar se landing está com problema
   - Agendar A/B teste no formulário

---

## 📱 Internacionalização

### Suporte de Idiomas

**URLs**:
- `/pt/partners` (Português)
- `/en/partners` (English)
- `/pt/partners/dashboard` (Dashboard PT)
- `/en/partners/dashboard` (Dashboard EN)

**Textos Traduzidos**:
- Elementos da UI
- Botões, labels, títulos
- Mensagens de erro
- Placeholders de formulário

**Fallback**: Se idioma não suportado → Português (padrão)

---

## 🚀 Próximas Melhorias (Roadmap)

- [ ] Gráficos avançados (multi-série)
- [ ] Alertas automáticos (quedas > 20%)
- [ ] Integração Slack/Email (relatórios diários)
- [ ] Dashboard 2FA com Google Auth
- [ ] Attribution multi-touch
- [ ] Análise de cohort
- [ ] Webhook para eventos B2B

---

## 📞 Suporte Técnico

**Problemas Comuns**:

| Problema                               | Solução                                                            |
| -------------------------------------- | ------------------------------------------------------------------ |
| "Dashboard protegido - Token inválido" | Verificar `PARTNERS_DASHBOARD_TOKEN` em `.env.local`               |
| Leads não aparecem                     | Verificar se `DATABASE_URL` está definida; testar `/api/promoters` |
| Cliques não rastreados                 | Verificar se eventos têm `?source=xxx` no link                     |
| CSV vazio                              | Aumentar período de dias ou remover filtros                        |

---

## 📝 Notas Finais

✅ **Implementado e Validado**:
- Rastreamento de cliques completo
- Captura de leads com validação
- Dashboard com comparação período-a-período
- Tabela interativa com 4 tipos de ordenação
- Exportação de dados
- Multi-idioma (PT/EN)

✅ **Segurança**:
- Token de autenticação
- Rate limiting
- Validação de entrada
- CORS/Origin checking

✅ **Performance**:
- Fallback em memória se sem BD
- Queries otimizadas em PostgreSQL
- Build estático com rotas dinâmicas
- Deploy-ready (Next.js 16)

---

**Data de Criação**: 18 de Fevereiro de 2026  
**Versão**: 1.0.0  
**Status**: ✅ Produção

<!-- markdownlint-enable -->
