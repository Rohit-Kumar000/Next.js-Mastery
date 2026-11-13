
'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw, Copy, Inbox } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

import type { Message } from '@/model/User';
import type { ApiResponse } from '@/types/ApiResponse';
import { acceptMessageSchema } from '@/schema/acceptMessageSchema';

type FormValues = z.infer<typeof acceptMessageSchema>;

function UserDashboard() {
  // States
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  // Session
  const { data: session, status } = useSession();

  // Form
  const { control, setValue } = useForm<FormValues>({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: false,
    },
  });

  const acceptMessages = useWatch({
    control,
    name: 'acceptMessages',
    defaultValue: false,
  });

  // Username
  const username = (
    session?.user as { username?: string } | undefined
  )?.username;

  // Profile URL
  const profileUrl = username
    ? `/u/${username}`
    : '';

  // Fetch messages
  const fetchMessages = useCallback(async (showToast = false) => {
    setIsLoading(true);

    try {
      const response = await axios.get<ApiResponse>(
        '/api/get-messages'
      );

      setMessages(response.data.messages ?? []);

      if (showToast) {
        toast.success('Messages refreshed', {
          description: 'Showing your latest messages.',
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error('Unable to fetch messages', {
        description:
          axiosError.response?.data.message ??
          'Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch initial dashboard data
  useEffect(() => {
    if (status !== 'authenticated') return;

    let isMounted = true;

    const loadDashboard = async () => {
      try {
        const [messagesResult, settingsResult] =
          await Promise.allSettled([
            axios.get<ApiResponse>('/api/get-messages'),
            axios.get<ApiResponse>('/api/accept-messages'),
          ]);

        if (!isMounted) return;

        // Messages
        if (messagesResult.status === 'fulfilled') {
          setMessages(
            messagesResult.value.data.messages ?? []
          );
        } else {
          const error = messagesResult.reason as AxiosError<ApiResponse>;

          toast.error('Unable to fetch messages', {
            description:
              error.response?.data.message ??
              'Failed to fetch messages.',
          });
        }

        // Message settings
        if (settingsResult.status === 'fulfilled') {
          setValue(
            'acceptMessages',
            settingsResult.value.data.isAcceptingMessages ?? false
          );
        } else {
          const error = settingsResult.reason as AxiosError<ApiResponse>;

          toast.error('Unable to fetch settings', {
            description:
              error.response?.data.message ??
              'Failed to fetch message settings.',
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [status, setValue]);

  // Delete message
  const handleDeleteMessage = (messageId: string) => {
    setMessages((previousMessages) =>
      previousMessages.filter(
        (message) => String(message._id) !== messageId
      )
    );
  };

  // Handle accept messages switch
  const handleSwitchChange = async (checked: boolean) => {
    setIsSwitchLoading(true);

    try {
      const response = await axios.post<ApiResponse>(
        '/api/accept-messages',
        {
          acceptMessages: checked,
        }
      );

      setValue('acceptMessages', checked);

      toast.success(
        response.data.message ?? 'Settings updated successfully'
      );
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error('Unable to update settings', {
        description:
          axiosError.response?.data.message ??
          'Please try again.',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  // Copy profile URL
  const copyToClipboard = async () => {
    if (!profileUrl) return;

    try {
      const fullUrl = new URL(
        profileUrl,
        window.location.origin
      ).toString();

      await navigator.clipboard.writeText(fullUrl);

      toast.success('URL Copied!', {
        description: 'Your profile link has been copied.',
      });
    } catch {
      toast.error('Copy failed', {
        description: 'Unable to copy your profile URL.',
      });
    }
  };

  // Loading session
  if (status === 'loading') {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Authentication check
  if (status === 'unauthenticated' || !session?.user) {
    return null;
  }

  return (
    <main className="flex-1 bg-gray-50 px-3 py-6 sm:px-4 sm:py-8">
      <div className="mx-auto w-full max-w-6xl rounded-xl bg-white p-4 shadow-sm sm:p-6 md:p-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
            User Dashboard
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your messages and profile settings.
          </p>
        </div>

        {/* Profile Link */}
        <section className="mb-8">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            Your Unique Profile Link
          </h2>

          <p className="mb-3 text-sm text-gray-500">
            Share this link with others to receive anonymous messages.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={
                profileUrl
                  ? new URL(
                      profileUrl,
                      typeof window !== 'undefined'
                        ? window.location.origin
                        : 'http://localhost'
                    ).toString()
                  : ''
              }
              disabled
              readOnly
              className="w-full min-w-0 truncate rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none"
            />

            <Button
              onClick={copyToClipboard}
              disabled={!profileUrl}
              className="shrink-0"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
          </div>
        </section>

        <Separator />

        {/* Message Settings */}
        <section className="my-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Accept Messages
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Allow people to send anonymous messages.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-sm font-medium ${
                acceptMessages ? 'text-green-600' : 'text-gray-500'
              }`}>
                {acceptMessages ? 'Enabled' : 'Disabled'}
              </span>

              <Switch
                checked={acceptMessages ?? false}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
              />

              {isSwitchLoading && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
            </div>
          </div>
        </section>

        <Separator />

        {/* Messages Header */}
        <section className="mt-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Your Messages
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                View and manage your received messages.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => fetchMessages(true)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="mr-2 h-4 w-4" />
              )}

              Refresh
            </Button>
          </div>

          {/* Messages List */}
          {isLoading && messages.length === 0 ? (
            <div className="flex min-h-40 items-center justify-center gap-2 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading messages...</span>
            </div>
          ) : messages.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {messages.map((message) => (
                <MessageCard
                  key={String(message._id)}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 px-4 text-center">
              <Inbox className="mb-3 h-12 w-12 text-gray-400" />

              <h3 className="text-lg font-semibold text-gray-900">
                No Messages Yet
              </h3>

              <p className="mt-2 max-w-sm text-sm text-gray-500">
                You haven&apos;t received any messages yet. Share your
                profile link to start receiving anonymous messages.
              </p>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}

export default UserDashboard;
