
"use client";

import React from "react";
import { motion, type Transition } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const transition: Transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

interface MenuItemProps {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}

interface MenuProps {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}

interface ProductItemProps {
  title: string;
  description: string;
  href: string;
  src: string;
}

interface HoveredLinkProps
  extends React.ComponentProps<typeof Link> {
  children: React.ReactNode;
}

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: MenuItemProps) => {
  return (
    <div
      onMouseEnter={() => setActive(item)}
      className="relative"
    >
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-black hover:opacity-90 dark:text-white"
      >
        {item}
      </motion.p>

      {active === item && children && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 5 }}
          transition={transition}
          className="absolute left-1/2 top-[calc(100%+1.7rem)] -translate-x-1/2"
        >
          <motion.div
            layoutId="active"
            transition={transition}
            className="overflow-hidden rounded-2xl border border-black/20 bg-white shadow-xl backdrop-blur-sm dark:border-white/20 dark:bg-black"
          >
            <motion.div
              layout
              className="h-full w-max p-4"
            >
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
}: MenuProps) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className="relative flex justify-center space-x-4 rounded-full bg-white px-8 py-6 shadow-input dark:bg-black"
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: ProductItemProps) => {
  return (
    <Link
      href={href}
      className="flex space-x-2"
    >
      <Image
        src={src}
        width={140}
        height={70}
        alt={title}
        className="shrink-0 rounded-md shadow-2xl"
      />

      <div>
        <h4 className="mb-1 text-xl font-bold text-black dark:text-white">
          {title}
        </h4>

        <p className="max-w-40 text-sm text-neutral-700 dark:text-neutral-300">
          {description}
        </p>
      </div>
    </Link>
  );
};

export const HoveredLink = ({
  children,
  className,
  ...rest
}: HoveredLinkProps) => {
  return (
    <Link
      {...rest}
      className={`text-neutral-700 transition-colors hover:text-black dark:text-neutral-200 dark:hover:text-white ${
        className ?? ""
      }`}
    >
      {children}
    </Link>
  );
};
