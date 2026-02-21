# Configuração

Ficheiros de configuração, variáveis de ambiente e setup.

## Ficheiros

### db_url.txt

Referência de formato para URL de base de dados PostgreSQL.

## Como Usar

### Setup local

1. Copie `.env.example` para `.env.local`.
2. Configure `DATABASE_URL` no `.env.local`.
3. Arranque a app com `npm run dev`.

### Deploy em produção

1. Configure variáveis de ambiente na plataforma de deploy.
2. Garanta `DATABASE_URL` para persistência real.
3. Valide logs na primeira execução.

### Sem base de dados (dev)

Sem `DATABASE_URL`, algumas áreas usam fallback em memória/ficheiro e não persistem entre reinícios.

## Variáveis de Ambiente

| Variável                      | Tipo    | Obrigatória | Descrição                                      |
| ----------------------------- | ------- | ----------- | ---------------------------------------------- |
| DATABASE_URL                  | String  | Não*        | URL PostgreSQL para persistência               |
| POSTGRES_SSL                  | String  | Não         | SSL para Postgres (`require` ou `disable`)     |
| RESEND_API_KEY                | String  | Não         | API key para envio de emails                   |
| RESEND_FROM_EMAIL             | String  | Não         | Remetente para emails de contacto/subscrição   |
| CONTACT_EMAIL                 | String  | Não         | Email destino para contactos                   |
| NEXT_PUBLIC_SITE_URL          | String  | Não         | URL pública do site                            |
| NEXT_PUBLIC_SUPABASE_URL      | String  | Não         | Endpoint Supabase (auth)                       |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | String  | Não         | Chave pública Supabase                         |
| PARTNERS_DASHBOARD_TOKEN      | String  | Não         | Token de acesso ao dashboard partners          |
| PARTNERS_DASHBOARD_USER       | String  | Não         | Username para Basic Auth (export)              |
| PARTNERS_DASHBOARD_PASSWORD   | String  | Não         | Password para Basic Auth (export)              |
| SHOW_PARTNER_DASHBOARD        | Boolean | Não         | Exibe link de dashboard na página partners     |
| PERF_METRICS_KEY              | String  | Não         | Chave para endpoint de métricas de performance |
| NEXT_PUBLIC_SOCIAL_SPOTIFY    | String  | Não         | Link social Spotify                            |
| NEXT_PUBLIC_SOCIAL_APPLE      | String  | Não         | Link social Apple Podcasts                     |
| NEXT_PUBLIC_SOCIAL_YOUTUBE    | String  | Não         | Link social YouTube                            |
| NEXT_PUBLIC_SOCIAL_INSTAGRAM  | String  | Não         | Link social Instagram                          |
| NEXT_PUBLIC_SOCIAL_X          | String  | Não         | Link social X                                  |
| NEXT_DEV_ALLOWED_ORIGINS      | String  | Não         | Origins permitidas em dev                      |

* Recomendado em produção.

## Nota sobre Podcast Images

* Banner fixo da página de podcast: `/podcasts/images/podcast-banner.png`.
* Imagem por episódio: definida em `data/episodes.ts` via `imageUrl`.

Última atualização: 21 de Fevereiro de 2026.
