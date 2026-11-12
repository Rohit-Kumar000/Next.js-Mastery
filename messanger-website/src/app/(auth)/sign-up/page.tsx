
'use client';

import { ApiResponse } from '@/types/ApiResponse';
import { signUpSchema } from '@/schema/signUpSchema';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useDebounceValue  } from 'usehooks-ts';
import { useEffect, useState } from 'react';
import * as z from 'zod';

import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from '@/components/ui/field';

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const [debouncedUsername] = useDebounceValue(username, 300);

  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  // Check username availability
  useEffect(() => {
  let isActive = true;

  const checkUsernameUnique = async () => {
    const currentUsername = debouncedUsername.trim();

    if (!currentUsername) {
      setUsernameMessage('');
      setIsCheckingUsername(false);
      return;
    }

    setIsCheckingUsername(true);
    setUsernameMessage('');

    try {
      const response = await axios.get<ApiResponse>(
        `/api/check-username-unique?username=${encodeURIComponent(currentUsername)}`
      );

      if (isActive) {
        setUsernameMessage(response.data.message);
      }
    } catch (error) {
      if (isActive) {
        const message = axios.isAxiosError<ApiResponse>(error)
          ? error.response?.data?.message
          : undefined;

        setUsernameMessage(message || 'Error checking username');
      }
    } finally {
      if (isActive) {
        setIsCheckingUsername(false);
      }
    }
  };

  checkUsernameUnique();

  return () => {
    isActive = false;
  };
}, [debouncedUsername]);

  // Handle signup
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    try {
      const response = await axios.post<ApiResponse>(
        '/api/sign-up',
        data
      );

      toast.success(response.data.message || 'Signup successful');

      router.replace(`/verify/${encodeURIComponent(data.username)}`);

    } catch (error) {
      console.error('Error during sign-up:', error);

      const errorMessage = axios.isAxiosError<ApiResponse>(error)
        ? error.response?.data?.message
        : undefined;

      toast.error(
        errorMessage || 'There was a problem with your sign-up. Please try again.'
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-800">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">

        <div className="text-center">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Join True Feedback
          </h1>

          <p className="mb-4">
            Sign up to start your anonymous adventure
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          {/* Username */}
          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="username">
                  Username
                </FieldLabel>

                <Input
                  {...field}
                  id="username"
                  aria-invalid={fieldState.invalid}
                  onChange={(e) => {
                    field.onChange(e);
                    setUsername(e.target.value);
                  }}
                />

                {isCheckingUsername && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {!isCheckingUsername && usernameMessage && (
                  <p
                    className={`text-sm ${
                      usernameMessage === 'Username is unique'
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {usernameMessage}
                  </p>
                )}

                <FieldError>
                  {fieldState.error?.message}
                </FieldError>
              </Field>
            )}
          />

          {/* Email */}
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">
                  Email
                </FieldLabel>

                <Input
                  {...field}
                  id="email"
                  type="email"
                  aria-invalid={fieldState.invalid}
                />

                <FieldDescription>
                  We will send you a verification code.
                </FieldDescription>

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
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              'Sign Up'
            )}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p>
            Already a member?{' '}
            <Link
              href="/sign-in"
              className="text-blue-600 hover:text-blue-800"
            >
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
