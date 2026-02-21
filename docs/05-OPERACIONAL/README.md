# Operacional

Guias operacionais e gestão de features para parceiros.

## Ficheiros

### PARTNERS_DASHBOARD_GUIDE.md

Guia completo do dashboard de partners/promoters.

- Acesso ao dashboard
- Funcionalidades e métricas
- Interpretação de dados
- Troubleshooting

### PARTNERS_DASHBOARD_GUIDE.pdf

Versão PDF para partilha e impressão.

## Como Usar

### Sou partner e quero usar o dashboard

Leia `PARTNERS_DASHBOARD_GUIDE.md`.

### Preciso de apresentar isto a partners

Use `PARTNERS_DASHBOARD_GUIDE.pdf`.

### Estou com problemas de acesso

Consulte a secção de troubleshooting no guia principal.

## Autenticação

O ecossistema de partners suporta token e, no endpoint de export, também HTTP Basic Auth.

```text
URL: https://what-to-do.vercel.app/pt/partners/dashboard
Autenticação principal: PARTNERS_DASHBOARD_TOKEN
Autenticação adicional (export): HTTP Basic Auth
  - PARTNERS_DASHBOARD_USER
  - PARTNERS_DASHBOARD_PASSWORD
```

O link público do dashboard pode ser exibido com `SHOW_PARTNER_DASHBOARD=true`.

## Métricas Disponíveis

- Impressões
- Clicks
- Leads
- Engagement

Última atualização: 21 de Fevereiro de 2026.
