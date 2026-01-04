"use client";

import type { Transition, Variants } from "motion/react";

// Spring animation presets
export const springs = {
  gentle: { type: "spring", stiffness: 120, damping: 14 } as const,
  snappy: { type: "spring", stiffness: 400, damping: 30 } as const,
  bouncy: { type: "spring", stiffness: 300, damping: 10 } as const,
} satisfies Record<string, Transition>;

// Basic entrance animations
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.15, ease: "easeOut" },
  },
};

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springs.gentle,
  },
};

// Message animations
export const messageItemUser: Variants = {
  hidden: { opacity: 0, x: 12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

export const messageItemAssistant: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

// Form animations
export const formFieldContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

export const formField: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springs.snappy,
  },
};

// Success animation
export const successBounce: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springs.bouncy,
  },
};

// Content block animations
export const chartEntrance: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springs.gentle,
  },
};

export const codeEntrance: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springs.snappy,
  },
};

export const cardEntrance: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.gentle,
  },
};

// Gesture animations
export const buttonTap = { scale: 0.97 };
export const buttonTapMobile = { scale: 0.95 };
export const buttonHover = { scale: 1.02 };

// SVG animations
export const checkmarkDraw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// Loading animation
export const loadingPulse: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

// Sidebar animations
export const sidebarSpring = {
  type: "spring",
  stiffness: 300,
  damping: 30,
} as const;

export const popupEntrance: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.95,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

export const menuEntrance: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.15, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: 8,
    scale: 0.95,
    transition: { duration: 0.1, ease: "easeIn" },
  },
};

// Staggered children animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};
