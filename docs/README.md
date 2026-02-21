# Documentação - What To Do Website

Centro de documentação do projeto What To Do.

## Índice de Pastas

### [01-COMEAR-AQUI](./01-COMEAR-AQUI/)

Entrada principal para onboarding e setup local.

- `00-GUIA_INICIO.txt` - arranque rápido, comandos e convenções de paths.

### [02-STATUS-ATUAL](./02-STATUS-ATUAL/)

Snapshots de estado e checkups recentes do projeto.

- `CHECKUP_SUMMARY_2026-02-19.txt`
- `STATUS_DASHBOARD_2026-02-19.txt`

### [03-RELATORIOS](./03-RELATORIOS/)

Relatórios detalhados, auditorias e histórico de validação.

- `FINAL_REPORT.md`
- `FINAL_CHECKUP_2026-02-19.md`
- `AUDIT_REPORT.md`
- `AUDIT_EXECUTION_2026-02-18.md`

### [04-TECNICO](./04-TECNICO/)

Contexto de implementação, continuidade e backlog técnico.

- `IMPLEMENTATION_STATUS.md`
- `CONTINUATION_NOTES.md`
- `TODO.md`

### [05-OPERACIONAL](./05-OPERACIONAL/)

Guias de operação para fluxos de parceiros e equipa de negócio.

- `PARTNERS_DASHBOARD_GUIDE.md`
- `PARTNERS_DASHBOARD_GUIDE.pdf`

### [06-CONFIGURACAO](./06-CONFIGURACAO/)

Variáveis de ambiente, setup e referências de configuração.

- `db_url.txt`

## Guia Rápido por Caso de Uso

### Quero começar do zero

1. Leia [01-COMEAR-AQUI/00-GUIA_INICIO.txt](./01-COMEAR-AQUI/00-GUIA_INICIO.txt).
2. Consulte [06-CONFIGURACAO/README.md](./06-CONFIGURACAO/README.md).

### Qual é o estado atual

Consulte [02-STATUS-ATUAL](./02-STATUS-ATUAL/).

### Preciso de detalhe técnico

Consulte [04-TECNICO](./04-TECNICO/).

### Como usar o dashboard de partners

Leia [05-OPERACIONAL/PARTNERS_DASHBOARD_GUIDE.md](./05-OPERACIONAL/PARTNERS_DASHBOARD_GUIDE.md).

## Regras de Organização (sem quebrar paths)

- Não mover nem renomear pastas base sem refatorar imports.
- Para assets em `public/`, usar paths absolutos iniciando por `/`.
- Banner da página de podcast: `/podcasts/images/podcast-banner.png` (fixo).
- Imagem por episódio: definida em `data/episodes.ts` no campo `imageUrl`.
- Antes de renomear/mover ficheiros, procurar referências em `app/`, `components/`, `data/`, `docs/` e `scripts/`.

## Dicas

- Ordem recomendada de leitura: 01 -> 06 -> 02 -> 04 -> 03.
- Para onboarding: [01-COMEAR-AQUI](./01-COMEAR-AQUI/).
- Para auditorias: [03-RELATORIOS](./03-RELATORIOS/).
- Para retomada técnica: [04-TECNICO/CONTINUATION_NOTES.md](./04-TECNICO/CONTINUATION_NOTES.md).

Última atualização: 21 de Fevereiro de 2026.
