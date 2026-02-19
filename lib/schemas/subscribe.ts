import { z } from 'zod';

export const SubscribeSchema = z.object({
    name: z.string().min(2, { message: 'Nome é obrigatório' }).max(120, { message: 'Nome muito longo' }),
    email: z.string().email({ message: 'Email deve ser válido' }).min(1, { message: 'Email é obrigatório' }),
    gdprConsent: z.boolean().refine((value) => value === true, {
        message: 'Consentimento é obrigatório'
    }),
    subject: z.enum(['newsletter', 'events', 'new_episodes']).default('newsletter').optional(),
    locale: z.enum(['pt', 'en']).default('pt').optional(),
});

export type SubscribeInput = z.infer<typeof SubscribeSchema>;

export interface SubscribeResponse {
    success: boolean;
    message: string;
    email?: string;
    error?: string;
}
