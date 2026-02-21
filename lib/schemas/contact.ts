import { z } from 'zod';

export const ContactSchema = z.object({
    name: z.string().min(2, { message: 'Nome é obrigatório (mínimo 2 caracteres)' }).max(120, { message: 'Nome muito longo' }),
    email: z.string().email({ message: 'Email deve ser válido' }).min(1, { message: 'Email é obrigatório' }),
    subject: z.string().min(3, { message: 'Assunto é obrigatório (mínimo 3 caracteres)' }).max(200, { message: 'Assunto muito longo' }),
    message: z.string().min(10, { message: 'Mensagem muito curta (mínimo 10 caracteres)' }).max(5000, { message: 'Mensagem muito longa' }),
    locale: z.enum(['pt', 'en']).default('pt').optional(),
});

export type ContactInput = z.infer<typeof ContactSchema>;

export interface ContactResponse {
    success: boolean;
    message: string;
    error?: string;
}
