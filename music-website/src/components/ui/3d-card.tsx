
"use client";

import { cn } from "@/utils/cn";
import React, {
  createContext,
  useState,
  useContext,
  useRef,
} from "react";

const MouseEnterContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined);

interface CardContainerProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export const CardContainer = ({
  children,
  className,
  containerClassName,
}: CardContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (!containerRef.current) return;

    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();

    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;

    containerRef.current.style.transform =
      `rotateY(${x}deg) rotateX(${-y}deg)`;
  };

  const handleMouseEnter = () => {
    setIsMouseEntered(true);
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;

    setIsMouseEntered(false);

    containerRef.current.style.transform =
      "rotateY(0deg) rotateX(0deg)";
  };

  return (
    <MouseEnterContext.Provider
      value={[isMouseEntered, setIsMouseEntered]}
    >
      <div
        className={cn(
          "flex items-center justify-center py-20",
          containerClassName
        )}
        style={{ perspective: "1000px" }}
      >
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn(
            "relative flex items-center justify-center transition-all duration-200 ease-linear",
            className
          )}
          style={{ transformStyle: "preserve-3d" }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody = ({
  children,
  className,
}: CardBodyProps) => {
  return (
    <div
      className={cn(
        "h-96 w-96 transform-3d *:transform-3d",
        className
      )}
    >
      {children}
    </div>
  );
};

interface CardItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
}

const getValue = (value: number | string) =>
  typeof value === "number" ? `${value}px` : value;

export const CardItem = ({
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  style,
  ...rest
}: CardItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isMouseEntered] = useMouseEnter();

  const transform = isMouseEntered
    ? `translateX(${getValue(translateX)}) translateY(${getValue(translateY)}) translateZ(${getValue(translateZ)}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
    : "translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)";

  return (
    <div
      ref={ref}
      className={cn(
        "w-fit transition duration-200 ease-linear",
        className
      )}
      style={{
        ...style,
        transform,
      }}
      {...rest}
    >
      {children}
    </div>
  );
};

export const useMouseEnter = () => {
  const context = useContext(MouseEnterContext);

  if (context === undefined) {
    throw new Error(
      "useMouseEnter must be used within a CardContainer"
    );
  }

  return context;
};
