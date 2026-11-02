
"use client";

import { cn } from "@/utils/cn";
import { InfiniteMovingCards } from "./ui/infinite-moving-cards";

const musicSchoolTestimonials = [
  {
    quote:
      "Joining the music school transformed my understanding of music and helped me to truly discover my own sound. The instructors are world-class!",
    name: "Alex Johnson",
    title: "Guitar Student",
  },
  {
    quote:
      "The community and support at this school are unmatched. I've grown not just as a pianist, but also as a performer, thanks to their comprehensive approach.",
    name: "Samantha Lee",
    title: "Piano Student",
  },
  {
    quote:
      "This school offered me the tools and confidence to take my singing to the next level. I'm endlessly grateful for the personalized coaching.",
    name: "Michael Chen",
    title: "Vocal Student",
  },
  {
    quote:
      "As a violinist, finding the right mentor can be challenging, but this school matched me with a teacher who truly understands my goals and challenges.",
    name: "Emily Taylor",
    title: "Violin Student",
  },
  {
    quote:
      "The production courses here opened my eyes to the intricacies of music production. Highly recommend for any aspiring producers!",
    name: "Chris Morales",
    title: "Music Production Student",
  },
];

function MusicSchoolTestimonials() {
  return (
    <section className="relative flex min-h-200 w-full items-center justify-center overflow-hidden bg-white dark:bg-[#151515]">

      {/* Grid Background */}
      <div
        className={cn(
          "absolute inset-0",
          "bg-size-[30px_30px]",
          "bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />

      {/* Radial Fade */}
      <div className="pointer-events-none absolute inset-0 bg-white mask-[radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-[#151515]" />

      {/* Content */}
      <div className="relative z-10 flex w-full flex-col items-center justify-center">

        <div className="mb-12 px-4 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#009588]">
            Testimonials
          </span>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
            Hear Our Harmony:
            <span className="text-[#white]">
              {" "}Voices of Success
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-neutral-600 dark:text-neutral-400 sm:text-base">
            Real experiences, genuine stories, and inspiring journeys
            from our music learning community.
          </p>
        </div>

        <div className="w-full overflow-hidden px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <InfiniteMovingCards
              items={musicSchoolTestimonials}
              direction="right"
              speed="slow"
              pauseOnHover
            />
          </div>
        </div>

      </div>
    </section>
  );
}

export default MusicSchoolTestimonials;
