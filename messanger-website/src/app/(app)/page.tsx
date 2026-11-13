
'use client';

import { Mail } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';

import messages from '@/messages.json';
import { useMemo } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Home() {
  const autoplayPlugin = useMemo(
  () =>
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
    }),
  []
);

  return (
    <>
      <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-gray-800 px-4 py-12 text-white md:px-24">

        {/* Hero Section */}
        <section className="mb-10 text-center md:mb-12">
          <h1 className="text-3xl font-bold leading-tight md:text-5xl">
            Dive into the World of Anonymous Feedback
          </h1>

          <p className="mt-4 text-base text-gray-300 md:text-lg">
            True Feedback - Where your identity remains a secret.
          </p>
        </section>

        {/* Messages Carousel */}
        <section className="w-full max-w-lg md:max-w-xl">
          <Carousel
            plugins={[autoplayPlugin]}
            opts={{
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem
                  key={`${message.title}-${index}`}
                  className="p-4"
                >
                  <Card className="min-h-44">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {message.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex items-start gap-4">
                      <Mail className="mt-1 h-6 w-6 shrink-0 text-primary" />

                      <div className="space-y-2">
                        <p className="text-sm leading-relaxed">
                          {message.content}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-gray-900 px-4 py-6 text-center text-sm text-gray-300">
        <p>
          © {new Date().getFullYear()} Messanger.
          All rights reserved.
        </p>
      </footer>
    </>
  );
}
