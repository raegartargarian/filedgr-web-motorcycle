import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import React from "react";

const TONES = {
  primary: "border-primary/20 bg-primary/10 text-primary",
  success: "border-trellis-400/30 bg-trellis-900/40 text-trellis-400",
  warning: "border-gold-400/30 bg-gold-400/10 text-gold-300",
  neutral: "border-steel-500 bg-steel-700 text-mist-100",
} as const;

interface StatTileProps {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  tone?: keyof typeof TONES;
  className?: string;
}

/** One fact with an icon: used for record summaries and vault stats. */
export const StatTile: React.FC<StatTileProps> = ({
  icon: Icon,
  label,
  value,
  tone = "primary",
  className,
}) => (
  <div className={cn("u-card flex items-center gap-3 p-4", className)}>
    <div
      className={cn(
        "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border",
        TONES[tone],
      )}
    >
      <Icon className="h-4 w-4" />
    </div>
    <div className="min-w-0">
      <div className="u-eyebrow">{label}</div>
      <div className="truncate text-sm font-medium text-glow-50">{value}</div>
    </div>
  </div>
);

export default StatTile;
