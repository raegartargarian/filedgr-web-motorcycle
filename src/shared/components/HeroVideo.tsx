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
 * Full-bleed looping studio video with the readability vignette on top.
 * Fills its (relative) parent; `children` render above the footage. Viewers
 * who prefer reduced motion get the poster frame only.
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
        {reducedMotion ? (
          <img src={heroPoster} alt="" className="h-full w-full object-cover" />
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
        <div className="absolute inset-0 u-vignette" />
      </div>
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

export default HeroVideo;
