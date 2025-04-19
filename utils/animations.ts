"use client"

import type { Variants } from "framer-motion"

// Fade in animation
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
}

// Fade up animation
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

// Staggered children animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Scale animation
export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
}

// Slide in from left
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
}

// Slide in from right
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
}

// Pulse animation for buttons
export const pulse: Variants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      yoyo: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
}

// Rotate animation
export const rotate: Variants = {
  hover: {
    rotate: [0, 5, 0, -5, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
}

// Bounce animation
export const bounce: Variants = {
  hover: {
    y: [0, -10, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
}
