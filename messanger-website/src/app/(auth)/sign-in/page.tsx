
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { signInSchema } from '@/schema/signInSchema';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';

import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function SignInForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
      });

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          toast.error('Incorrect username or password');
        } else {
          toast.error(result.error);
        }

        return;
      }

      if (result?.ok) {
        toast.success('Login successful!');

        router.replace('/dashboard');
        router.refresh();
      }
    } catch (error) {
      console.error('Login error:', error);

      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-800">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">

        <div className="text-center">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Welcome Back to True Feedback
          </h1>

          <p className="mb-4">
            Sign in to continue your secret conversations
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          {/* Email / Username */}
          <Controller
            name="identifier"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="identifier">
                  Email / Username
                </FieldLabel>

                <Input
                  {...field}
                  id="identifier"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter email or username"
                  aria-invalid={fieldState.invalid}
                />

                <FieldError>
                  {fieldState.error?.message}
                </FieldError>
              </Field>
            )}
          />

          {/* Password */}
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">
                  Password
                </FieldLabel>

                <Input
                  {...field}
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  aria-invalid={fieldState.invalid}
                />

                <FieldError>
                  {fieldState.error?.message}
                </FieldError>
              </Field>
            )}
          />

          {/* Submit Button */}
          <Button
            className="w-full"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p>
            Not a member yet?{' '}
            <Link
              href="/sign-up"
              className="text-blue-600 hover:text-blue-800"
            >
              Sign up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
