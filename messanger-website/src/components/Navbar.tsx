'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <nav className="bg-gray-900 px-4 py-3 text-white shadow-md sm:px-6 sm:py-4">
      <div className="container mx-auto flex items-center justify-between gap-3">
        <Link href="/" className="text-lg font-bold sm:text-xl">
          Messanger
        </Link>

        {session ? (
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <span className="hidden max-w-[12rem] truncate text-sm sm:inline md:max-w-xs">
              Welcome, {user?.username || user?.email}
            </span>

            <Link
              href="/dashboard"
              className="text-sm text-gray-300 transition hover:text-white"
            >
              Dashboard
            </Link>

            <Button
              onClick={() => signOut({ callbackUrl: '/sign-in' })}
              className="bg-slate-100 text-black"
              variant="outline"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'bg-slate-100 text-black'
            )}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
