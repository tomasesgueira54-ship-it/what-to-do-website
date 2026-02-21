/**
 * Auth Callback Route
 * Handles OAuth redirects (Google, etc.) and email confirmation links.
 * Exchanges the auth code for a session, then redirects to the account page.
 */
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/pt/account';
    const locale = next.startsWith('/en') ? 'en' : 'pt';

    if (!isSupabaseConfigured()) {
        return NextResponse.redirect(`${origin}/${locale}/auth/login?error=supabase_not_configured`);
    }

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // Get user info for welcome email
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                // Send welcome email via our internal API
                try {
                    const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User';
                    await sendWelcomeEmail(user.email!, name, locale);
                } catch (emailError) {
                    console.error('[auth/callback] Welcome email error:', emailError);
                    // Don't block auth flow for email failure
                }
            }

            const forwardedHost = request.headers.get('x-forwarded-host');
            const isLocalEnv = process.env.NODE_ENV === 'development';

            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${next}`);
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`);
            } else {
                return NextResponse.redirect(`${origin}${next}`);
            }
        }
    }

    // Auth code exchange failed — redirect to login with error
    return NextResponse.redirect(`${origin}/${locale}/auth/login?error=auth_callback_error`);
}

/**
 * Send welcome email via Resend (server-side)
 */
async function sendWelcomeEmail(email: string, name: string, locale: string) {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;

    if (!apiKey || !fromEmail) {
        console.warn('[auth/callback] Welcome email skipped — RESEND_API_KEY or RESEND_FROM_EMAIL not configured');
        return;
    }

    // Dynamic import to avoid bundling Resend in auth callback if not needed
    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://what-to-do.vercel.app';
    const isPt = locale === 'pt';

    const subject = isPt
        ? '🎉 Bem-vindo ao What To Do Lisboa!'
        : '🎉 Welcome to What To Do Lisbon!';

    const html = buildAuthWelcomeEmail(name, locale as 'pt' | 'en', siteUrl);

    await resend.emails.send({
        from: fromEmail,
        to: email,
        subject,
        html,
    });

    console.log(`[auth/callback] Welcome email sent to ${email}`);
}

function buildAuthWelcomeEmail(name: string, locale: 'pt' | 'en', siteUrl: string): string {
    const isPt = locale === 'pt';
    const eventsUrl = `${siteUrl}/${locale}/events`;
    const podcastUrl = `${siteUrl}/${locale}/episodes`;
    const accountUrl = `${siteUrl}/${locale}/account`;

    return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body,table,td{font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;}
    img{border:0;line-height:100%;outline:none;text-decoration:none;}
    a{color:#C10206;text-decoration:none;}
    @media only screen and (max-width:600px){
      .container{width:100%!important;padding:16px!important;}
      .btn{display:block!important;width:100%!important;text-align:center!important;box-sizing:border-box!important;}
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#000000;">
  <div style="display:none;font-size:1px;color:#000;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    ${isPt ? 'A tua conta foi criada com sucesso! Descobre Lisboa.' : 'Your account was created successfully! Discover Lisbon.'}
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#000;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="600" class="container" style="background:#111110;border:1px solid #252523;border-radius:16px;overflow:hidden;">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#8E0D3C 0%,#5a0826 50%,#C10206 100%);padding:48px 40px;text-align:center;">
          <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:12px;padding:12px 16px;margin-bottom:16px;">
            <span style="color:#fff;font-size:28px;">🎉</span>
          </div>
          <h1 style="margin:8px 0 0;color:#fff;font-size:28px;font-weight:800;letter-spacing:-0.5px;">
            ${isPt ? 'Bem-vindo ao What To Do!' : 'Welcome to What To Do!'}
          </h1>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px;">
          <p style="color:#fff;font-size:18px;font-weight:700;margin:0 0 16px;">
            ${isPt ? `Olá ${name}!` : `Hi ${name}!`}
          </p>
          <p style="color:#AAA;font-size:14px;line-height:1.8;margin:0 0 24px;">
            ${isPt
            ? 'A tua conta no What To Do Lisboa foi criada com sucesso. Agora tens acesso a funcionalidades exclusivas: guardar eventos favoritos, criar a tua agenda personalizada e receber recomendações à medida.'
            : 'Your What To Do Lisbon account has been created successfully. You now have access to exclusive features: save favorite events, create your personalized agenda, and receive tailored recommendations.'}
          </p>

          <!-- Features -->
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:32px;">
            <tr><td style="padding:16px;background:#000;border-radius:12px;border:1px solid #252523;">
              <p style="color:#fff;font-size:15px;font-weight:700;margin:0 0 4px;">
                ${isPt ? '❤️ Eventos Favoritos' : '❤️ Favorite Events'}
              </p>
              <p style="color:#AAA;font-size:13px;line-height:1.6;margin:0;">
                ${isPt ? 'Guarda os eventos que mais te interessam e acede-os rapidamente.' : 'Save events you\'re interested in and access them quickly.'}
              </p>
            </td></tr>
            <tr><td style="height:8px;"></td></tr>
            <tr><td style="padding:16px;background:#000;border-radius:12px;border:1px solid #252523;">
              <p style="color:#fff;font-size:15px;font-weight:700;margin:0 0 4px;">
                ${isPt ? '📅 Agenda Pessoal' : '📅 Personal Agenda'}
              </p>
              <p style="color:#AAA;font-size:13px;line-height:1.6;margin:0;">
                ${isPt ? 'Organiza a tua semana com os eventos que vais frequentar.' : 'Plan your week with the events you\'ll attend.'}
              </p>
            </td></tr>
            <tr><td style="height:8px;"></td></tr>
            <tr><td style="padding:16px;background:#000;border-radius:12px;border:1px solid #252523;">
              <p style="color:#fff;font-size:15px;font-weight:700;margin:0 0 4px;">
                ${isPt ? '🎙️ Conteúdo Exclusivo' : '🎙️ Exclusive Content'}
              </p>
              <p style="color:#AAA;font-size:13px;line-height:1.6;margin:0;">
                ${isPt ? 'Acede a episódios especiais do podcast e guias detalhados.' : 'Access special podcast episodes and detailed guides.'}
              </p>
            </td></tr>
          </table>

          <!-- CTA Buttons -->
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:24px;">
            <tr><td align="center" style="padding:4px;">
              <a href="${accountUrl}" class="btn" style="display:inline-block;background:#8E0D3C;color:#fff;padding:14px 32px;border-radius:10px;font-weight:700;font-size:14px;width:80%;text-align:center;">
                ${isPt ? 'Ver Minha Conta →' : 'View My Account →'}
              </a>
            </td></tr>
            <tr><td style="height:8px;"></td></tr>
            <tr><td align="center" style="padding:4px;">
              <a href="${eventsUrl}" class="btn" style="display:inline-block;background:transparent;color:#fff;padding:12px 32px;border-radius:10px;font-weight:600;font-size:14px;border:2px solid #8E0D3C;width:80%;text-align:center;">
                ${isPt ? 'Explorar Eventos' : 'Explore Events'}
              </a>
            </td></tr>
            <tr><td style="height:8px;"></td></tr>
            <tr><td align="center" style="padding:4px;">
              <a href="${podcastUrl}" class="btn" style="display:inline-block;background:transparent;color:#fff;padding:12px 32px;border-radius:10px;font-weight:600;font-size:14px;border:2px solid #252523;width:80%;text-align:center;">
                ${isPt ? 'Ouvir Podcast' : 'Listen to Podcast'}
              </a>
            </td></tr>
          </table>

          <div style="border-top:1px solid #252523;margin-top:24px;padding-top:24px;">
            <p style="color:#fff;font-size:14px;font-weight:600;margin:0 0 4px;">${isPt ? 'A equipa What To Do' : 'The What To Do Team'}</p>
            <p style="color:#6E6E6E;font-size:12px;margin:0;">whattodoofficialmail@gmail.com</p>
          </div>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#000;padding:24px 40px;border-top:1px solid #252523;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr><td align="center">
              <p style="color:#6E6E6E;font-size:11px;margin:0 0 8px;">${isPt ? 'Segue-nos' : 'Follow us'}</p>
              <p style="margin:0 0 16px;">
                <a href="https://instagram.com/whattodomedia" style="color:#6E6E6E;margin:0 8px;font-size:12px;">Instagram</a>
                <span style="color:#252523;">•</span>
                <a href="https://youtube.com/@whattodo" style="color:#6E6E6E;margin:0 8px;font-size:12px;">YouTube</a>
              </p>
              <p style="color:#333;font-size:10px;margin:0;">© ${new Date().getFullYear()} What To Do Lisboa. All rights reserved.</p>
            </td></tr>
          </table>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
