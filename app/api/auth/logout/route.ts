/**
 * Logout API Route
 */
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export async function POST() {
    if (!isSupabaseConfigured()) {
        return NextResponse.json(
            { success: false, message: 'Auth não configurado.', error: 'SUPABASE_NOT_CONFIGURED' },
            { status: 503 }
        );
    }

    const supabase = await createClient();
    await supabase.auth.signOut();

    return NextResponse.json({ success: true, message: 'Sessão terminada.' }, { status: 200 });
}
