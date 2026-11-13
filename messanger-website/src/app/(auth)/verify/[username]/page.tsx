
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';

import { ApiResponse } from '@/types/ApiResponse';
import { verifySchema } from '@/schema/verifySchema';

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';

export default function VerifyAccount() {
  const router = useRouter();

  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post<ApiResponse>(
        '/api/verify-code',
        {
          username: params.username,
          code: data.code,
        }
      );

      toast.success(response.data.message || 'Account verified successfully');

      router.replace('/sign-in');

    } catch (error) {
      const errorMessage = axios.isAxiosError<ApiResponse>(error)
        ? error.response?.data?.message
        : undefined;

      toast.error(
        errorMessage || 'An error occurred. Please try again.'
      );
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-md sm:space-y-8 sm:p-8">

        <div className="text-center">
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight sm:mb-6 sm:text-4xl">
            Verify Your Account
          </h1>

          <p className="mb-4">
            Enter the verification code sent to your email.
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          <Controller
            name="code"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="code">
                  Verification Code
                </FieldLabel>

                <Input
                  {...field}
                  id="code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="6-digit code"
                  maxLength={6}
                  aria-invalid={fieldState.invalid}
                />

                <FieldError>
                  {fieldState.error?.message}
                </FieldError>
              </Field>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Account'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
