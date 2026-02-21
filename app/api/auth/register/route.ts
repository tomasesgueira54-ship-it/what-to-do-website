/**
 * Registration API Route
 * Signs up a user with Supabase Auth (email + password) and sends welcome email via Resend.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { z } from 'zod';

const RegisterSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'Password deve ter pelo menos 8 caracteres'),
    name: z.string().min(1, 'Nome é obrigatório').max(100),
    locale: z.enum(['pt', 'en']).optional().default('pt'),
});

export type RegisterResponse = {
    success: boolean;
    message: string;
    error?: string;
};

export async function POST(request: NextRequest): Promise<NextResponse<RegisterResponse>> {
    try {
        const body = await request.json();
        const validated = RegisterSchema.parse(body);

        const locale = validated.locale;
        const isPt = locale === 'pt';

        if (!isSupabaseConfigured()) {
            return NextResponse.json(
                {
                    success: false,
                    message: isPt
                        ? 'Registo indisponível temporariamente. Configuração de autenticação em falta.'
                        : 'Registration is temporarily unavailable. Authentication configuration is missing.',
                    error: 'SUPABASE_NOT_CONFIGURED',
                },
                { status: 503 }
            );
        }

        const supabase = await createClient();

        // Sign up with Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email: validated.email,
            password: validated.password,
            options: {
                data: {
                    full_name: validated.name,
                    locale,
                },
                emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://what-to-do.vercel.app'}/auth/callback?next=/${locale}/account`,
            },
        });

        if (error) {
            console.error('[api/auth/register] Supabase error:', error);

            // Common Supabase auth errors
            if (error.message?.includes('already registered') || error.message?.includes('User already registered')) {
                return NextResponse.json(
                    {
                        success: false,
                        message: isPt ? 'Este email já está registado.' : 'This email is already registered.',
                        error: 'EMAIL_ALREADY_REGISTERED',
                    },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                {
                    success: false,
                    message: isPt ? 'Erro ao criar conta. Tenta novamente.' : 'Error creating account. Please try again.',
                    error: error.message,
                },
                { status: 400 }
            );
        }

        // Send welcome email via Resend
        try {
            await sendWelcomeEmail(validated.email, validated.name, locale);
        } catch (emailError) {
            console.error('[api/auth/register] Welcome email error:', emailError);
            // Don't block registration for email failure
        }

        // Check if email confirmation is required
        const needsConfirmation = data.user && !data.session;

        return NextResponse.json(
            {
                success: true,
                message: needsConfirmation
                    ? isPt
                        ? 'Conta criada! Verifica o teu email para confirmar o registo.'
                        : 'Account created! Check your email to confirm your registration.'
                    : isPt
                        ? 'Conta criada com sucesso! Bem-vindo ao What To Do.'
                        : 'Account created successfully! Welcome to What To Do.',
            },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors = error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
            return NextResponse.json(
                { success: false, message: 'Validation error', error: fieldErrors },
                { status: 400 }
            );
        }

        console.error('[api/auth/register] Unexpected error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

/**
 * Send welcome email via Resend
 */
async function sendWelcomeEmail(email: string, name: string, locale: string) {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;

    if (!apiKey || !fromEmail) {
        console.warn('[api/auth/register] Welcome email skipped — RESEND_API_KEY or RESEND_FROM_EMAIL not configured');
        return;
    }

    const { Resend } = await import('resend');
    const resend = new Resend(apiKey);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://what-to-do.vercel.app';
    const isPt = locale === 'pt';

    await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: isPt ? '🎉 Bem-vindo ao What To Do Lisboa!' : '🎉 Welcome to What To Do Lisbon!',
        html: buildWelcomeEmailHtml(name, locale as 'pt' | 'en', siteUrl),
    });
}

function buildWelcomeEmailHtml(name: string, locale: 'pt' | 'en', siteUrl: string): string {
    const isPt = locale === 'pt';
    const eventsUrl = `${siteUrl}/${locale}/events`;
    const accountUrl = `${siteUrl}/${locale}/account`;

    return `<!DOCTYPE html>
<html lang="${locale}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>body,table,td{font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;}a{color:#C10206;text-decoration:none;}@media only screen and (max-width:600px){.container{width:100%!important;padding:16px!important;}.btn{display:block!important;width:100%!important;text-align:center!important;}}</style>
</head>
<body style="margin:0;padding:0;background:#000;">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#000;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" cellpadding="0" cellspacing="0" width="600" class="container" style="background:#111110;border:1px solid #252523;border-radius:16px;overflow:hidden;">
<tr><td style="background:linear-gradient(135deg,#8E0D3C,#5a0826,#C10206);padding:48px 40px;text-align:center;">
<div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:12px;padding:12px 16px;margin-bottom:16px;"><span style="color:#fff;font-size:28px;">🎉</span></div>
<h1 style="margin:8px 0 0;color:#fff;font-size:28px;font-weight:800;">${isPt ? 'Bem-vindo ao What To Do!' : 'Welcome to What To Do!'}</h1>
</td></tr>
<tr><td style="padding:40px;">
<p style="color:#fff;font-size:18px;font-weight:700;margin:0 0 16px;">${isPt ? `Olá ${name}!` : `Hi ${name}!`}</p>
<p style="color:#AAA;font-size:14px;line-height:1.8;margin:0 0 24px;">${isPt ? 'A tua conta foi criada com sucesso. Agora podes guardar eventos favoritos, criar a tua agenda e receber recomendações personalizadas.' : 'Your account has been created successfully. You can now save favorite events, create your agenda and receive personalized recommendations.'}</p>
<table role="presentation" width="100%" style="margin-bottom:24px;">
<tr><td align="center"><a href="${accountUrl}" class="btn" style="display:inline-block;background:#8E0D3C;color:#fff;padding:14px 32px;border-radius:10px;font-weight:700;font-size:14px;width:80%;text-align:center;">${isPt ? 'Aceder à Minha Conta →' : 'Go to My Account →'}</a></td></tr>
<tr><td style="height:8px;"></td></tr>
<tr><td align="center"><a href="${eventsUrl}" class="btn" style="display:inline-block;background:transparent;color:#fff;padding:12px 32px;border-radius:10px;font-weight:600;font-size:14px;border:2px solid #8E0D3C;width:80%;text-align:center;">${isPt ? 'Explorar Eventos' : 'Explore Events'}</a></td></tr>
</table>
<div style="border-top:1px solid #252523;padding-top:24px;"><p style="color:#fff;font-size:14px;font-weight:600;margin:0 0 4px;">${isPt ? 'A equipa What To Do' : 'The What To Do Team'}</p><p style="color:#6E6E6E;font-size:12px;margin:0;">whattodoofficialmail@gmail.com</p></div>
</td></tr>
<tr><td style="background:#000;padding:24px 40px;border-top:1px solid #252523;text-align:center;">
<p style="color:#333;font-size:10px;margin:0;">© ${new Date().getFullYear()} What To Do Lisboa</p>
</td></tr>
</table>
</td></tr></table>
</body></html>`;
}
