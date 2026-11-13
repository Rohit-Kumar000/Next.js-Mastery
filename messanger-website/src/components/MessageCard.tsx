
'use client';

import { useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { X, Loader2 } from 'lucide-react';
import type { Message } from '@/model/User';
import type { ApiResponse } from '@/types/ApiResponse';

import {
  Card,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({
  message,
  onMessageDelete,
}: MessageCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);

      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );

      toast.success(response.data.message);

      onMessageDelete(String(message._id));

    } catch (error) {
      const errorMessage = axios.isAxiosError<ApiResponse>(error)
        ? error.response?.data?.message
        : undefined;

      toast.error(errorMessage || 'Failed to delete message');

    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="card-bordered">
      <CardHeader>
        <div className="flex justify-between items-center gap-4">

          <CardTitle className="wrap-break-word">
            {message.content}
          </CardTitle>

          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  variant="destructive"
                  size="icon"
                  disabled={isDeleting}
                >
                  <X className="w-5 h-5" />
                </Button>
              }
            />

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you absolutely sure?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  This action cannot be undone. This will permanently
                  delete this message.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel disabled={isDeleting}>
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'Continue'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </div>

        <div className="text-sm text-muted-foreground">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </div>
      </CardHeader>
    </Card>
  );
}
