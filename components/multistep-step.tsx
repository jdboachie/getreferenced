'use client';

import { motion } from "motion/react";

export default function Step({ step }: { step: number }) {
  return (
    <motion.div>{step}</motion.div>
  )
}
