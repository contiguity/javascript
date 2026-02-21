import { z } from "zod";

export const emailSendSchema = z
    .object({
        to: z.union([z.string(), z.array(z.string()).max(10)]),
        from: z.string(),
        subject: z.string(),
        body: z
            .object({
                text: z.string().nullable().optional(),
                html: z.string().nullable().optional(),
            })
            .refine((b) => {
                const has_text = b.text != null && b.text !== "";
                const has_html = b.html != null && b.html !== "";
                return has_text || has_html;
            }, "Either body.text or body.html must be provided (non-empty)"),
        reply_to: z.string().nullable().optional(),
        cc: z.union([z.string(), z.array(z.string()).max(10)]).nullable().optional(),
        bcc: z.union([z.string(), z.array(z.string()).max(10)]).nullable().optional(),
        headers: z.record(z.string(), z.string()).nullable().optional(),
    })
    .loose();

export type EmailSendParams = z.infer<typeof emailSendSchema>;
