import heroPoster from "@/assets/videos/hero-poster.jpg";
import heroMp4 from "@/assets/videos/hero.mp4";
import heroWebm from "@/assets/videos/hero.webm";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

interface HeroVideoProps {
  className?: string;
  children?: React.ReactNode;
}

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * Looping studio video staged over an ambient backdrop. The footage is only
 * 1280x720, so the sharp copy never renders above its native size; a heavily
 * blurred poster fills the rest of the hero and the video's edges are
 * feathered into it so there is no visible frame. Fills its parent;
 * `children` render above the footage. Viewers who prefer reduced motion get
 * the poster frame only.
 */
export const HeroVideo: React.FC<HeroVideoProps> = ({
  className,
  children,
}) => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION);
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <div className={cn("relative overflow-hidden bg-abyss-950", className)}>
      <div className="absolute inset-0 pointer-events-none">
        {/* Ambient fill: the poster, blown up and blurred so its resolution
            never shows, dimmed to sit behind the sharp copy. */}
        <img
          src={heroPoster}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full scale-125 object-cover opacity-60 blur-3xl saturate-150"
        />

        {/* Sharp copy at or below native size, edges feathered away. */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="u-feather aspect-video w-full max-w-[1200px]">
            {reducedMotion ? (
              <img
                src={heroPoster}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <video
                autoPlay
                muted
                loop
                playsInline
                poster={heroPoster}
                className="h-full w-full object-cover"
              >
                <source src={heroWebm} type="video/webm" />
                <source src={heroMp4} type="video/mp4" />
              </video>
            )}
          </div>
        </div>

        <div className="absolute inset-0 u-vignette" />
      </div>
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

export default HeroVideo;
