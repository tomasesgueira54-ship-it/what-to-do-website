/**
 * Login API Route
 * Signs in a user with email + password via Supabase Auth.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { z } from 'zod';

const LoginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'Password é obrigatória'),
});

export type LoginResponse = {
    success: boolean;
    message: string;
    user?: {
        id: string;
        email: string;
        name: string;
    };
    error?: string;
};

export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse>> {
    try {
        const body = await request.json();
        const validated = LoginSchema.parse(body);

        if (!isSupabaseConfigured()) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Login indisponível temporariamente. Configuração de autenticação em falta.',
                    error: 'SUPABASE_NOT_CONFIGURED',
                },
                { status: 503 }
            );
        }

        const supabase = await createClient();

        const { data, error } = await supabase.auth.signInWithPassword({
            email: validated.email,
            password: validated.password,
        });

        if (error) {
            console.error('[api/auth/login] Supabase error:', error);
            return NextResponse.json(
                {
                    success: false,
                    message: error.message === 'Invalid login credentials'
                        ? 'Email ou password incorretos.'
                        : 'Erro ao fazer login. Tenta novamente.',
                    error: error.message,
                },
                { status: 401 }
            );
        }

        const user = data.user;
        return NextResponse.json(
            {
                success: true,
                message: 'Login efetuado com sucesso!',
                user: {
                    id: user.id,
                    email: user.email!,
                    name: user.user_metadata?.full_name || user.email!.split('@')[0],
                },
            },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldErrors = error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
            return NextResponse.json(
                { success: false, message: 'Validation error', error: fieldErrors },
                { status: 400 }
            );
        }

        console.error('[api/auth/login] Unexpected error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error', error: 'Unknown error' },
            { status: 500 }
        );
    }
}
