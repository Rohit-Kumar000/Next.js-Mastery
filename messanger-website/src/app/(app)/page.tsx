
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
      <main className="flex flex-1 flex-col items-center justify-center bg-gray-800 px-4 py-10 text-white sm:py-12 md:px-24">

        {/* Hero Section */}
        <section className="mb-10 text-center md:mb-12">
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Share a link. Get honest messages.
          </h1>

          <p className="mt-4 text-base text-gray-300 md:text-lg">
            Messanger lets friends send you anonymous messages, privately and on your terms.
          </p>
        </section>

        {/* Messages Carousel */}
        <section className="w-full max-w-lg overflow-hidden md:max-w-xl md:overflow-visible">
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

            <CarouselPrevious className="hidden md:inline-flex" />
            <CarouselNext className="hidden md:inline-flex" />
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
