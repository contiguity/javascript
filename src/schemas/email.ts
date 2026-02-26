import { z } from "zod";

const bodySchema = z
    .object({
        text: z.string().nullable().optional(),
        html: z.string().nullable().optional(),
        react: z.unknown().optional(),
    })
    .optional();

export const emailSendSchema = z
    .object({
        to: z.union([z.string(), z.array(z.string()).max(10)]),
        from: z.string(),
        subject: z.string(),
        html: z.string().nullable().optional(),
        text: z.string().nullable().optional(),
        react: z.unknown().optional(),
        /** @deprecated Use top-level html, text, or react instead */
        body: bodySchema,
        reply_to: z.string().nullable().optional(),
        cc: z.union([z.string(), z.array(z.string()).max(10)]).nullable().optional(),
        bcc: z.union([z.string(), z.array(z.string()).max(10)]).nullable().optional(),
        headers: z.record(z.string(), z.string()).nullable().optional(),
    })
    .refine(
        (p) => {
            const has_html = (p.html ?? p.body?.html) != null && (p.html ?? p.body?.html) !== "";
            const has_text = (p.text ?? p.body?.text) != null && (p.text ?? p.body?.text) !== "";
            const has_react = p.react ?? p.body?.react;
            return has_html || has_text || !!has_react;
        },
        { message: "Either html, text, or react must be provided" }
    )
    .loose();

export type EmailSendParams = z.infer<typeof emailSendSchema>;
