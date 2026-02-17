import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { SubscribeSchema, type SubscribeResponse } from '@/lib/schemas/subscribe';
import { z } from 'zod';

// In-memory storage (replace with database in production)
const subscribers = new Set<string>();

export async function POST(request: NextRequest): Promise<NextResponse<SubscribeResponse>> {
    try {
        const body = await request.json();

        // Validate input
        const validated = SubscribeSchema.parse(body);

        // Apply defaults
        const locale = (validated.locale || 'pt') as 'pt' | 'en';
        const normalizedEmail = validated.email.trim().toLowerCase();
        const normalizedName = validated.name.trim();

        // Check if already subscribed
        if (subscribers.has(normalizedEmail)) {
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

        // Send welcome email via Resend (if API key is available)
        const apiKey = process.env.RESEND_API_KEY;
        if (apiKey) {
            const resend = new Resend(apiKey);

            const emailSubject = {
                pt: 'Bem-vindo ao What To Do!',
                en: 'Welcome to What To Do!'
            }[locale];

            const emailBody = {
                pt: `
          <h2>Bem-vindo ao What To Do!</h2>
      <p>Olá ${normalizedName},</p>
          <p>Obrigado por te subscreveres à nossa newsletter.</p>
          <p>Vais receber actualizações sobre:</p>
          <ul>
            <li>Eventos imperdíveis em Lisboa</li>
            <li>Novos episódios do podcast</li>
            <li>Guias e roteiros exclusivos</li>
          </ul>
          <p>Até breve!</p>
          <p>What To Do Team</p>
        `,
                en: `
          <h2>Welcome to What To Do!</h2>
          <p>Hi ${normalizedName},</p>
          <p>Thank you for subscribing to our newsletter.</p>
          <p>You will receive updates about:</p>
          <ul>
            <li>Must-see events in Lisbon</li>
            <li>New podcast episodes</li>
            <li>Exclusive guides and itineraries</li>
          </ul>
          <p>See you soon!</p>
          <p>What To Do Team</p>
        `
            }[locale];

            try {
                await resend.emails.send({
                    from: 'noreply@whattodo.pt',
                    to: normalizedEmail,
                    subject: emailSubject,
                    html: emailBody,
                });
            } catch (emailError) {
                console.error('Resend email error:', emailError);
                // Continue anyway - email sending failure shouldn't block subscription
            }
        } else {
            console.warn('RESEND_API_KEY not configured. Email will not be sent.');
        }

        // Store subscription (in memory for now)
        subscribers.add(normalizedEmail);

        return NextResponse.json(
            {
                success: true,
                message: locale === 'pt'
                    ? 'Obrigado por te subscreveres!'
                    : 'Thank you for subscribing!',
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
