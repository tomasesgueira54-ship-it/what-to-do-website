import { z } from "zod";

export const PromoterLeadSchema = z.object({
    name: z.string().min(2, { message: "Name must have at least 2 characters" }).max(100),
    email: z.string().email({ message: "Invalid email" }),
    company: z.string().min(2, { message: "Company is required" }).max(120),
    category: z.enum(["events", "guides", "transfers", "brand"]),
    budget: z.enum(["under_500", "500_2000", "2000_plus", "unknown"]),
    message: z.string().min(10, { message: "Message too short" }).max(2000),
    website: z
        .string()
        .trim()
        .optional()
        .transform((value) => value || undefined)
        .refine(
            (value) => !value || /^https?:\/\//i.test(value),
            { message: "Website must start with http:// or https://" },
        ),
    locale: z.enum(["pt", "en"]).optional().default("pt"),
});

export type PromoterLeadInput = z.infer<typeof PromoterLeadSchema>;

export type PromoterLeadResponse = {
    success: boolean;
    message: string;
    error?: string;
    id?: string;
};
