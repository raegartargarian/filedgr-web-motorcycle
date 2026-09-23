import { HeroVideo } from "@/shared/components/HeroVideo";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import React from "react";

interface HeroIntroProps {
  eyebrow: string;
  /** Headline lines; the last one is rendered in the accent colour. */
  title: string[];
  subtitle: string;
  actions: React.ReactNode;
  /** Rendered inside the hero above everything, e.g. a scroll cue. */
  children?: React.ReactNode;
}

/**
 * The hero block shared by the login screen and the signed-in landing page.
 * Same height, anchoring, type scale and motion in both places, so signing
 * in only swaps the copy and the header, and nothing jumps.
 */
export const HeroIntro: React.FC<HeroIntroProps> = ({
  eyebrow,
  title,
  subtitle,
  actions,
  children,
}) => (
  <HeroVideo className="h-[calc(100svh-64px)] min-h-[640px]">
    <div className="container mx-auto flex h-full flex-col justify-end px-4 pb-20 md:pb-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-2xl text-center md:text-left"
      >
        <span className="u-eyebrow inline-flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          {eyebrow}
        </span>
        <h1 className="u-display mt-4 text-4xl leading-[1.05] sm:text-5xl lg:text-7xl">
          {title.map((line, i) => (
            <React.Fragment key={line}>
              {i > 0 && <br />}
              {i === title.length - 1 ? (
                <span className="text-primary">{line}</span>
              ) : (
                line
              )}
            </React.Fragment>
          ))}
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-base text-mist-200 md:mx-0 md:text-lg">
          {subtitle}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:items-start">
          {actions}
        </div>
      </motion.div>
    </div>
    {children}
  </HeroVideo>
);

export default HeroIntro;
