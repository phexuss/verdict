import * as z from 'zod';

export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password is required and must be at least 8 characters long'),
});

export const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Name is required and must be at least 3 characters long')
    .max(32, 'Name must be less than 32 characters long'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password must be less than 128 characters long'),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
