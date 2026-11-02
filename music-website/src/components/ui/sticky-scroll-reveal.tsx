
"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";

export const StickyScroll = ({
  content,
}: {
  content: {
    title: string;
    description: string;
  }[];
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end end"],
  });

  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (cardLength === 0) return;

    const index = Math.min(
      Math.floor(latest * cardLength),
      cardLength - 1
    );

    setActiveCard((previous) =>
      previous === index ? previous : index
    );
  });

  const backgroundColors = [
    "var(--slate-900)",
    "var(--black)",
    "var(--neutral-900)",
  ];

  const linearGradients = [
    "linear-gradient(to bottom right, #06b6d4, #10b981)",
    "linear-gradient(to bottom right, #ec4899, #6366f1)",
    "linear-gradient(to bottom right, #f97316, #eab308)",
  ];

  return (
    <motion.div
      ref={ref}
      animate={{
        backgroundColor:
          backgroundColors[activeCard % backgroundColors.length],
      }}
      transition={{ duration: 0.3 }}
      className="relative h-150 overflow-y-auto rounded-md p-6 sm:p-10 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="relative flex items-start justify-between gap-10">

        {/* Left Content */}
        <div className="w-full min-w-0 lg:w-1/2">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-20">
              <motion.h2
                initial={false}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                transition={{ duration: 0.25 }}
                className="text-2xl font-bold text-slate-100"
              >
                {item.title}
              </motion.h2>

              <motion.p
                initial={false}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                transition={{ duration: 0.25 }}
                className="mt-10 max-w-sm text-base leading-relaxed text-slate-300"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-40" />
        </div>

        {/* Right Gradient Box */}
        <div className="sticky top-30 hidden h-60 w-80 shrink-0 lg:block">
          <motion.div
            animate={{
              background:
                linearGradients[
                  activeCard % linearGradients.length
                ],
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
            className="h-full w-full rounded-md shadow-2xl"
          />
        </div>

      </div>
    </motion.div>
  );
};
