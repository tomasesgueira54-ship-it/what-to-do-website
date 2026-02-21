import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ContactSchema, type ContactResponse } from '@/lib/schemas/contact';
import { z } from 'zod';
import { recordFunnelEvent } from '@/lib/server/analytics-store';

const requestLog = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'whattodoofficialmail@gmail.com';
const hasResendApiKey = Boolean(process.env.RESEND_API_KEY);
const hasFromEmail = Boolean(process.env.RESEND_FROM_EMAIL);
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://what-to-do.vercel.app';

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return 'unknown';
}

function isRateLimited(request: NextRequest): boolean {
  const key = `contact:${getClientIp(request)}`;
  const now = Date.now();

  if (requestLog.size > 500) {
    for (const [mapKey, values] of requestLog.entries()) {
      const fresh = values.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
      if (fresh.length === 0) requestLog.delete(mapKey);
      else requestLog.set(mapKey, fresh);
    }
  }

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

export async function POST(request: NextRequest): Promise<NextResponse<ContactResponse>> {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.toLowerCase().includes('application/json')) {
      return NextResponse.json(
        { success: false, message: 'Unsupported content type', error: 'UNSUPPORTED_CONTENT_TYPE' },
        { status: 415 }
      );
    }

    if (!isAllowedOrigin(request)) {
      return NextResponse.json(
        { success: false, message: 'Forbidden origin', error: 'FORBIDDEN_ORIGIN' },
        { status: 403 }
      );
    }

    if (isRateLimited(request)) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please try again later.', error: 'RATE_LIMITED' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = ContactSchema.parse(body);

    const locale = (validated.locale || 'pt') as 'pt' | 'en';
    if (!hasResendApiKey || !hasFromEmail) {
      return NextResponse.json(
        {
          success: false,
          message: locale === 'pt'
            ? 'Serviço de contacto temporariamente indisponível. Tenta novamente em breve.'
            : 'Contact service is temporarily unavailable. Please try again soon.',
          error: 'EMAIL_SERVICE_NOT_CONFIGURED',
        },
        { status: 503 }
      );
    }

    const normalizedEmail = validated.email.trim().toLowerCase();
    const safeName = escapeHtml(validated.name.trim());
    const safeEmail = escapeHtml(normalizedEmail);
    const safeSubject = escapeHtml(validated.subject.trim());
    const safeMessage = escapeHtml(validated.message.trim());

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@whattodo.pt';

    if (apiKey) {
      const resend = new Resend(apiKey);
      let teamEmailSent = false;

      // Send email to team
      try {
        await resend.emails.send({
          from: fromEmail,
          to: CONTACT_EMAIL,
          replyTo: normalizedEmail,
          subject: `[What To Do Contact] ${safeSubject}`,
          html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#000;font-family:'Inter',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="background:#111110;border:1px solid #252523;border-radius:16px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#8E0D3C 0%,#C10206 100%);padding:24px 32px;">
        <h1 style="color:#fff;font-size:20px;margin:0;font-weight:700;">📩 New Contact Message</h1>
      </div>
      <div style="padding:32px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid #252523;color:#6E6E6E;font-size:13px;width:100px;">Name</td>
            <td style="padding:12px 0;border-bottom:1px solid #252523;color:#fff;font-size:14px;font-weight:600;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid #252523;color:#6E6E6E;font-size:13px;">Email</td>
            <td style="padding:12px 0;border-bottom:1px solid #252523;color:#fff;font-size:14px;"><a href="mailto:${safeEmail}" style="color:#C10206;text-decoration:none;">${safeEmail}</a></td>
          </tr>
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid #252523;color:#6E6E6E;font-size:13px;">Subject</td>
            <td style="padding:12px 0;border-bottom:1px solid #252523;color:#fff;font-size:14px;font-weight:600;">${safeSubject}</td>
          </tr>
        </table>
        <div style="margin-top:24px;padding:20px;background:#000;border-radius:12px;border:1px solid #252523;">
          <p style="color:#6E6E6E;font-size:11px;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Message</p>
          <p style="color:#fff;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap;">${safeMessage}</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`,
        });
        teamEmailSent = true;
      } catch (emailError) {
        console.error('Failed to send contact email:', emailError);
      }

      if (!teamEmailSent) {
        return NextResponse.json(
          {
            success: false,
            message: locale === 'pt'
              ? 'Não foi possível enviar a mensagem de contacto. Tenta novamente em instantes.'
              : 'Could not send contact message. Please try again shortly.',
            error: 'EMAIL_SEND_FAILED',
          },
          { status: 502 }
        );
      }

      // Send confirmation to user
      const confirmationSubject = locale === 'pt'
        ? 'Recebemos a tua mensagem - What To Do'
        : 'We received your message - What To Do';

      const confirmationBody = locale === 'pt'
        ? `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#000;font-family:'Inter',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="background:#111110;border:1px solid #252523;border-radius:16px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#8E0D3C 0%,#C10206 100%);padding:32px;text-align:center;">
        <h1 style="color:#fff;font-size:24px;margin:0;font-weight:700;">Mensagem Recebida ✓</h1>
      </div>
      <div style="padding:32px;">
        <p style="color:#fff;font-size:16px;line-height:1.6;">Olá <strong>${safeName}</strong>,</p>
        <p style="color:#AAAAAA;font-size:14px;line-height:1.7;">Recebemos a tua mensagem e vamos responder o mais brevemente possível, normalmente dentro de 24-48 horas.</p>
        <p style="color:#AAAAAA;font-size:14px;line-height:1.7;">Enquanto esperas, descobre o que há para fazer em Lisboa:</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${siteUrl}/pt/events" style="display:inline-block;background:#8E0D3C;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Ver Próximos Eventos →</a>
        </div>
        <p style="color:#6E6E6E;font-size:12px;margin-top:32px;padding-top:16px;border-top:1px solid #252523;">This is an automated confirmation. Please do not reply to this email.</p>
      </div>
    </div>
  </div>
</body>
</html>`
        : `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#000;font-family:'Inter',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="background:#111110;border:1px solid #252523;border-radius:16px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#8E0D3C 0%,#C10206 100%);padding:32px;text-align:center;">
        <h1 style="color:#fff;font-size:24px;margin:0;font-weight:700;">Message Received ✓</h1>
      </div>
      <div style="padding:32px;">
        <p style="color:#fff;font-size:16px;line-height:1.6;">Hi <strong>${safeName}</strong>,</p>
        <p style="color:#AAAAAA;font-size:14px;line-height:1.7;">We received your message and will get back to you as soon as possible, typically within 24-48 hours.</p>
        <p style="color:#AAAAAA;font-size:14px;line-height:1.7;">In the meantime, discover what's happening in Lisbon:</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${siteUrl}/en/events" style="display:inline-block;background:#8E0D3C;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">View Upcoming Events →</a>
        </div>
        <p style="color:#6E6E6E;font-size:12px;margin-top:32px;padding-top:16px;border-top:1px solid #252523;">This is an automated confirmation. Please do not reply to this email.</p>
      </div>
    </div>
  </div>
</body>
</html>`;

      try {
        await resend.emails.send({
          from: fromEmail,
          to: normalizedEmail,
          subject: confirmationSubject,
          html: confirmationBody,
        });
      } catch (confirmError) {
        console.error('Failed to send confirmation email:', confirmError);
      }
    } else {
      console.warn('[contact] RESEND_API_KEY not configured. Emails not sent.');
    }

    const successMessage = locale === 'pt'
      ? 'Mensagem enviada com sucesso! Respondemos em breve.'
      : 'Message sent successfully! We\'ll get back to you soon.';

    try {
      await recordFunnelEvent({
        eventType: 'contact_success',
        locale,
        path: '/api/contact',
        referrer: request.headers.get('referer') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        clientIp: getClientIp(request),
      });
    } catch (analyticsError) {
      console.error('Contact analytics error:', analyticsError);
    }

    return NextResponse.json(
      { success: true, message: successMessage },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ');
      return NextResponse.json(
        { success: false, message: 'Validation error', error: fieldErrors },
        { status: 400 }
      );
    }

    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
