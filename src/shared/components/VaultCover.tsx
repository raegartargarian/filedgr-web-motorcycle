import { VaultImage } from "@/shared/components/VaultImage";
import { cn } from "@/lib/utils";
import { VaultDto } from "@/shared/types/vault";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

interface VaultCoverProps {
  vault: Pick<VaultDto, "image_cid" | "default_image_cid" | "name">;
  /** Full for the vault page, compact for pages one level down. */
  size?: "full" | "compact";
  backTo?: { to: string; label: string };
  eyebrow?: string;
  title: string;
  subtitle?: string | null;
  /** Pills and small facts under the title. */
  meta?: React.ReactNode;
  /** Buttons, right-aligned on wide screens. */
  actions?: React.ReactNode;
  /** A last line under the meta row, e.g. the verification hash. */
  children?: React.ReactNode;
}

/**
 * Page cover with the motorcycle photo as backdrop, in the same family as
 * the landing hero: bottom-anchored copy, display headline, vignette.
 */
export const VaultCover: React.FC<VaultCoverProps> = ({
  vault,
  size = "full",
  backTo,
  eyebrow,
  title,
  subtitle,
  meta,
  actions,
  children,
}) => (
  <section
    className={cn(
      "relative overflow-hidden border-b border-border bg-abyss-950",
      size === "full" ? "h-[52svh] min-h-[440px]" : "h-[36svh] min-h-[300px]",
    )}
  >
    <div className="absolute inset-0 pointer-events-none">
      <VaultImage
        vault={vault}
        imgClassName="h-full w-full object-cover"
        iconClassName="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 text-steel-500/50"
      />
      <div className="absolute inset-0 u-vignette" />
    </div>

    <div className="container relative z-10 mx-auto flex h-full flex-col justify-end px-4 pb-8 md:pb-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {backTo && (
          <Link
            to={backTo.to}
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-mist-200 transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            {backTo.label}
          </Link>
        )}
        {eyebrow && <span className="u-eyebrow block">{eyebrow}</span>}
        <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0 max-w-3xl">
            <h1
              className={cn(
                "u-display leading-[1.05]",
                size === "full"
                  ? "text-4xl sm:text-5xl lg:text-6xl"
                  : "text-3xl sm:text-4xl",
              )}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3 max-w-2xl text-base text-mist-200 md:text-lg">
                {subtitle}
              </p>
            )}
            {meta && (
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                {meta}
              </div>
            )}
          </div>
          {actions && (
            <div className="flex flex-shrink-0 flex-wrap items-center gap-2">
              {actions}
            </div>
          )}
        </div>
        {children && <div className="mt-4">{children}</div>}
      </motion.div>
    </div>
  </section>
);

export default VaultCover;
