import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { SubscribeSchema, type SubscribeResponse } from '@/lib/schemas/subscribe';
import { z } from 'zod';
import { hasSubscriber, addSubscriber } from '@/lib/server/subscriber-store';
import { recordFunnelEvent } from '@/lib/server/analytics-store';

// Rate limit tracking (in-memory is fine for this)
const requestLog = new Map<string, number[]>();

const hasResendApiKey = Boolean(process.env.RESEND_API_KEY);
const hasFromEmail = Boolean(process.env.RESEND_FROM_EMAIL);

if (!hasResendApiKey || !hasFromEmail) {
  console.warn('[subscribe] ⚠️  Email delivery is partially configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL to enable confirmations.');
}

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return 'unknown';
}

function isRateLimited(request: NextRequest): boolean {
  const key = getClientIp(request);
  const now = Date.now();
  const recent = (requestLog.get(key) || []).filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  requestLog.set(key, recent);
  return recent.length > RATE_LIMIT_MAX_REQUESTS;
}

function isAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  const host = request.headers.get('host');
  if (!host) return false;

  try {
    const originUrl = new URL(origin);
    return originUrl.host === host;
  } catch {
    return false;
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(request: NextRequest): Promise<NextResponse<SubscribeResponse>> {
  try {
    if (!isAllowedOrigin(request)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Forbidden origin',
          error: 'FORBIDDEN_ORIGIN'
        },
        { status: 403 }
      );
    }

    if (isRateLimited(request)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many requests. Please try again later.',
          error: 'RATE_LIMITED'
        },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate input
    const validated = SubscribeSchema.parse(body);

    // Apply defaults
    const locale = (validated.locale || 'pt') as 'pt' | 'en';
    const normalizedEmail = validated.email.trim().toLowerCase();
    const normalizedName = validated.name.trim();
    const safeName = escapeHtml(normalizedName);

    // Check if already subscribed (persistent file store)
    if (await hasSubscriber(normalizedEmail)) {
      return NextResponse.json(
        {
          success: false,
          message: locale === 'pt'
            ? 'Este email já está subscrito'
            : 'This email is already subscribed',
          error: 'ALREADY_SUBSCRIBED'
        },
        { status: 400 }
      );
    }

    // Send professional welcome email via Resend
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@whattodo.pt';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://what-to-do.vercel.app';
    const canSendEmail = Boolean(apiKey && process.env.RESEND_FROM_EMAIL);

    if (canSendEmail) {
      const resend = new Resend(apiKey);

      const emailSubject = locale === 'pt'
        ? '🎉 Bem-vindo ao What To Do Lisboa!'
        : '🎉 Welcome to What To Do Lisbon!';

      const emailBody = buildWelcomeEmail(safeName, locale, siteUrl);

      try {
        await resend.emails.send({
          from: fromEmail,
          to: normalizedEmail,
          subject: emailSubject,
          html: emailBody,
        });
      } catch (emailError) {
        console.error('Resend email error:', emailError);
        // Continue anyway - email sending failure shouldn't block subscription
      }
    } else {
      console.warn('[subscribe] Confirmation email not sent due to missing RESEND_API_KEY or RESEND_FROM_EMAIL.');
    }

    // Store subscription (persistent file store)
    await addSubscriber(normalizedEmail, normalizedName, locale);

    try {
      await recordFunnelEvent({
        eventType: 'subscribe_success',
        locale,
        path: '/api/subscribe',
        referrer: request.headers.get('referer') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        clientIp: getClientIp(request),
      });
    } catch (analyticsError) {
      console.error('Subscribe analytics error:', analyticsError);
    }

    return NextResponse.json(
      {
        success: true,
        message: locale === 'pt'
          ? canSendEmail
            ? 'Obrigado por te subscreveres!'
            : 'Subscrição registada com sucesso. Confirmação por email temporariamente indisponível.'
          : canSendEmail
            ? 'Thank you for subscribing!'
            : 'Subscription saved successfully. Confirmation email is temporarily unavailable.',
        email: normalizedEmail
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ');
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          error: fieldErrors
        },
        { status: 400 }
      );
    }

    console.error('Subscribe error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao processar subscrição. Tenta novamente.',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/* ───────────────────────────────────────────────
   Professional Welcome Email Template Builder
   ─────────────────────────────────────────────── */
function buildWelcomeEmail(name: string, locale: 'pt' | 'en', siteUrl: string): string {
  const isPt = locale === 'pt';
  const eventsUrl = `${siteUrl}/${locale}/events`;
  const podcastUrl = `${siteUrl}/${locale}/episodes`;
  const guidesUrl = `${siteUrl}/${locale}/blog`;
  const contactUrl = `${siteUrl}/${locale}/contact`;

  const t = {
    preheader: isPt
      ? 'Obrigado por te juntares à nossa comunidade! Descobre o que fazer em Lisboa.'
      : 'Thanks for joining our community! Discover what to do in Lisbon.',
    greeting: isPt ? `Olá ${name}!` : `Hi ${name}!`,
    welcome: isPt
      ? 'Bem-vindo ao What To Do Lisboa'
      : 'Welcome to What To Do Lisbon',
    intro: isPt
      ? 'Obrigado por te subscreveres à nossa newsletter. A partir de agora, vais descobrir sempre o que fazer em Lisboa — dos melhores concertos e festas aos restaurantes, terraces e experiências únicas de cada semana.'
      : 'Thank you for subscribing to our newsletter. From now on, you\'ll always know what to do in Lisbon — from the best concerts and parties to restaurants, terraces and unique experiences every week.',
    whatYouGet: isPt ? 'O que vais receber:' : 'What you\'ll get:',
    feature1Title: isPt ? '📅 Agenda Semanal' : '📅 Weekly Agenda',
    feature1Desc: isPt
      ? 'Curadoria dos melhores eventos, concertos, exposições e festas da semana em Lisboa.'
      : 'Curated best events, concerts, exhibitions and parties of the week in Lisbon.',
    feature2Title: isPt ? '🎙️ Podcast' : '🎙️ Podcast',
    feature2Desc: isPt
      ? 'Conversas com personalidades de Lisboa sobre a vida cultural da cidade.'
      : 'Conversations with Lisbon personalities about the city\'s cultural life.',
    feature3Title: isPt ? '📖 Guias & Roteiros' : '📖 Guides & Itineraries',
    feature3Desc: isPt
      ? 'Restaurantes, bares, passeios e experiências testadas pela nossa equipa.'
      : 'Restaurants, bars, tours and experiences tested by our team.',
    exploreTitle: isPt ? 'Começa já a explorar:' : 'Start exploring now:',
    eventsBtn: isPt ? 'Ver Próximos Eventos' : 'View Upcoming Events',
    podcastBtn: isPt ? 'Ouvir Podcast' : 'Listen to Podcast',
    guidesBtn: isPt ? 'Ler Guias' : 'Read Guides',
    contactText: isPt
      ? 'Tens alguma sugestão ou feedback? <a href="' + contactUrl + '" style="color:#C10206;text-decoration:none;font-weight:600;">Fala connosco</a>.'
      : 'Have a suggestion or feedback? <a href="' + contactUrl + '" style="color:#C10206;text-decoration:none;font-weight:600;">Talk to us</a>.',
    team: isPt ? 'A equipa What To Do' : 'The What To Do Team',
    unsubscribe: isPt
      ? 'Se já não quiseres receber os nossos emails, podes <a href="mailto:whattodoofficialmail@gmail.com?subject=Unsubscribe" style="color:#6E6E6E;text-decoration:underline;">cancelar a subscrição</a> a qualquer momento.'
      : 'If you no longer wish to receive our emails, you can <a href="mailto:whattodoofficialmail@gmail.com?subject=Unsubscribe" style="color:#6E6E6E;text-decoration:underline;">unsubscribe</a> at any time.',
    followUs: isPt ? 'Segue-nos' : 'Follow us',
  };

  return `<!DOCTYPE html>
<html lang="${locale}" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>${t.welcome}</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    body,table,td{font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;}
    img{border:0;line-height:100%;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;}
    a{color:#C10206;text-decoration:none;}
    @media only screen and (max-width:600px){
      .container{width:100%!important;padding:16px!important;}
      .feature-grid td{display:block!important;width:100%!important;padding:12px 0!important;}
      .btn{display:block!important;width:100%!important;text-align:center!important;box-sizing:border-box!important;}
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#000000;-webkit-font-smoothing:antialiased;">
  <!-- Preheader -->
  <div style="display:none;font-size:1px;color:#000000;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    ${t.preheader}
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#000000;">
    <tr><td align="center" style="padding:32px 16px;">

      <!-- Main Container -->
      <table role="presentation" cellpadding="0" cellspacing="0" width="600" class="container" style="background:#111110;border:1px solid #252523;border-radius:16px;overflow:hidden;">

        <!-- Header Gradient Banner -->
        <tr><td style="background:linear-gradient(135deg,#8E0D3C 0%,#5a0826 50%,#C10206 100%);padding:48px 40px;text-align:center;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr><td align="center">
              <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:12px;padding:12px 16px;margin-bottom:16px;">
                <span style="color:#fff;font-size:28px;">🎉</span>
              </div>
            </td></tr>
            <tr><td align="center" style="padding-top:8px;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px;line-height:1.2;">${t.welcome}</h1>
            </td></tr>
          </table>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px;">

          <!-- Greeting -->
          <p style="color:#ffffff;font-size:18px;font-weight:700;margin:0 0 16px;">${t.greeting}</p>
          <p style="color:#AAAAAA;font-size:14px;line-height:1.8;margin:0 0 32px;">${t.intro}</p>

          <!-- Features -->
          <p style="color:#ffffff;font-size:15px;font-weight:700;margin:0 0 20px;text-transform:uppercase;letter-spacing:1px;font-size:12px;">${t.whatYouGet}</p>

          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:32px;">
            <tr>
              <td style="padding:16px;background:#000;border-radius:12px;border:1px solid #252523;margin-bottom:12px;">
                <p style="color:#ffffff;font-size:15px;font-weight:700;margin:0 0 4px;">${t.feature1Title}</p>
                <p style="color:#AAAAAA;font-size:13px;line-height:1.6;margin:0;">${t.feature1Desc}</p>
              </td>
            </tr>
            <tr><td style="height:8px;"></td></tr>
            <tr>
              <td style="padding:16px;background:#000;border-radius:12px;border:1px solid #252523;">
                <p style="color:#ffffff;font-size:15px;font-weight:700;margin:0 0 4px;">${t.feature2Title}</p>
                <p style="color:#AAAAAA;font-size:13px;line-height:1.6;margin:0;">${t.feature2Desc}</p>
              </td>
            </tr>
            <tr><td style="height:8px;"></td></tr>
            <tr>
              <td style="padding:16px;background:#000;border-radius:12px;border:1px solid #252523;">
                <p style="color:#ffffff;font-size:15px;font-weight:700;margin:0 0 4px;">${t.feature3Title}</p>
                <p style="color:#AAAAAA;font-size:13px;line-height:1.6;margin:0;">${t.feature3Desc}</p>
              </td>
            </tr>
          </table>

          <!-- CTA Buttons -->
          <p style="color:#ffffff;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:0 0 16px;">${t.exploreTitle}</p>

          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:32px;">
            <tr>
              <td align="center" style="padding:4px;">
                <a href="${eventsUrl}" class="btn" style="display:inline-block;background:#8E0D3C;color:#ffffff;padding:14px 32px;border-radius:10px;font-weight:700;font-size:14px;text-decoration:none;width:80%;text-align:center;">${t.eventsBtn} →</a>
              </td>
            </tr>
            <tr><td style="height:8px;"></td></tr>
            <tr>
              <td align="center" style="padding:4px;">
                <a href="${podcastUrl}" class="btn" style="display:inline-block;background:transparent;color:#ffffff;padding:12px 32px;border-radius:10px;font-weight:600;font-size:14px;text-decoration:none;border:2px solid #8E0D3C;width:80%;text-align:center;">${t.podcastBtn}</a>
              </td>
            </tr>
            <tr><td style="height:8px;"></td></tr>
            <tr>
              <td align="center" style="padding:4px;">
                <a href="${guidesUrl}" class="btn" style="display:inline-block;background:transparent;color:#ffffff;padding:12px 32px;border-radius:10px;font-weight:600;font-size:14px;text-decoration:none;border:2px solid #252523;width:80%;text-align:center;">${t.guidesBtn}</a>
              </td>
            </tr>
          </table>

          <!-- Contact -->
          <p style="color:#AAAAAA;font-size:13px;line-height:1.7;margin:0 0 16px;">${t.contactText}</p>

          <!-- Sign off -->
          <div style="border-top:1px solid #252523;margin-top:24px;padding-top:24px;">
            <p style="color:#ffffff;font-size:14px;font-weight:600;margin:0 0 4px;">${t.team}</p>
            <p style="color:#6E6E6E;font-size:12px;margin:0;">whattodoofficialmail@gmail.com</p>
          </div>

        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#000;padding:24px 40px;border-top:1px solid #252523;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center">
                <p style="color:#6E6E6E;font-size:11px;margin:0 0 8px;">${t.followUs}</p>
                <p style="margin:0 0 16px;">
                  <a href="https://instagram.com/whattodomedia" style="color:#6E6E6E;text-decoration:none;margin:0 8px;font-size:12px;">Instagram</a>
                  <span style="color:#252523;">•</span>
                  <a href="https://youtube.com/@whattodo" style="color:#6E6E6E;text-decoration:none;margin:0 8px;font-size:12px;">YouTube</a>
                </p>
                <p style="color:#444;font-size:10px;line-height:1.6;margin:0;">${t.unsubscribe}</p>
                <p style="color:#333;font-size:10px;margin:8px 0 0;">© ${new Date().getFullYear()} What To Do Lisboa. All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
