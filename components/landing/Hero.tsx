"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { Magnetic } from "@/components/interactions/Magnetic";
import { RoadmapPreview } from "@/components/landing/RoadmapPreview";

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-start gap-6 text-left"
        >
          <Badge variant="primary">LLOYD Hackathon · Career Roadmapper</Badge>

          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Reverse-engineer your dream career.
          </h1>

          <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
            Turn a destination into a personalized path. Tell CareerForge
            exactly who you want to become — we break it into the skills,
            projects, and milestones that get you there.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Magnetic>
              <Link
                href="/onboarding"
                className={buttonVariants({ size: "lg" })}
              >
                Build My Roadmap
              </Link>
            </Magnetic>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              See how it works
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto w-full max-w-md lg:mx-0"
          id="roadmap-preview"
        >
          <RoadmapPreview />
        </motion.div>
      </div>
    </section>
  );
}
