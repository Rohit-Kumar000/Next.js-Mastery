
"use client";

import { cn } from "@/utils/cn";
import React, { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";

interface WavyBackgroundProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
}

const DEFAULT_COLORS = [
  "#38bdf8",
  "#818cf8",
  "#c084fc",
  "#e879f9",
  "#22d3ee",
];

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: WavyBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const noise = createNoise3D();

    const waveColors =
      colors && colors.length > 0 ? colors : DEFAULT_COLORS;

    const getSpeed = () => {
      switch (speed) {
        case "slow":
          return 0.001;
        case "fast":
          return 0.002;
        default:
          return 0.001;
      }
    };

    let w = 0;
    let h = 0;
    let nt = 0;
    let animationId = 0;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();

      w = canvas.width = rect.width;
      h = canvas.height = rect.height;

      ctx.filter = `blur(${blur}px)`;
    };

    const drawWave = (n: number) => {
      nt += getSpeed();

      for (let i = 0; i < n; i++) {
        ctx.beginPath();
        ctx.lineWidth = waveWidth || 50;
        ctx.strokeStyle = waveColors[i % waveColors.length];

        for (let x = 0; x < w; x += 5) {
          const y = noise(x / 800, 0.3 * i, nt) * 100;

          ctx.lineTo(x, y + h * 0.5);
        }

        ctx.stroke();
        ctx.closePath();
      }
    };

    const render = () => {
      ctx.fillStyle = backgroundFill || "black";
      ctx.globalAlpha = 1;
      ctx.fillRect(0, 0, w, h);

      ctx.globalAlpha = waveOpacity;
      drawWave(5);

      animationId = requestAnimationFrame(render);
    };

    resizeCanvas();

    const resizeObserver = new ResizeObserver(resizeCanvas);

    resizeObserver.observe(canvas.parentElement ?? canvas);

    render();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [
    colors,
    waveWidth,
    backgroundFill,
    blur,
    speed,
    waveOpacity,
  ]);

  return (
    <div
      className={cn(
        "relative flex h-screen w-full flex-col items-center justify-center overflow-hidden",
        containerClassName
      )}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      />

      <div
        className={cn("relative z-10", className)}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};
