import { z } from "zod";

export const voicePlaySchema = z.object({ audio_url: z.string() }).loose();
