import { z } from 'zod';

export const verifySchema = z.object({
  code: z.string().min(1, 'Verification code is required'),
});