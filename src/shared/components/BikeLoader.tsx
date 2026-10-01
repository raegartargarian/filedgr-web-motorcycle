import { Bike } from "lucide-react";

/**
 * A motorcycle riding along a road, for longer in-page work where a skeleton
 * has nothing to stand in for. Holds still under reduced motion.
 */
export const BikeLoader = () => (
  <div className="flex w-24 flex-col items-center" role="presentation">
    <Bike className="h-9 w-9 text-primary animate-bike-bob motion-reduce:animate-none" />
    <div className="mt-1 h-0.5 w-full animate-road-pass bg-[repeating-linear-gradient(90deg,hsl(var(--primary)/0.6)_0_12px,transparent_12px_24px)] motion-reduce:animate-none" />
  </div>
);
