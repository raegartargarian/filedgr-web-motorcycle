import {
  categorize,
  FilePreview,
  PreviewSource,
  SourceResolver,
} from "@filedgr/web-core/preview";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface FileLightboxProps {
  items: PreviewSource[];
  /** Index into `items`, or null when closed. */
  index: number | null;
  resolver: SourceResolver;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

/** Resolves the current source to a URL and releases it when it changes. */
const useResolvedUrl = (
  source: PreviewSource | null,
  resolver: SourceResolver,
) => {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!source) return;
    let release: (() => void) | undefined;
    let cancelled = false;
    setUrl(null);
    resolver
      .getUrl(source)
      .then((resolved) => {
        if (cancelled) return resolved.release?.();
        release = resolved.release;
        setUrl(resolved.url);
      })
      .catch((error) => console.error("Failed to resolve file:", error));
    return () => {
      cancelled = true;
      release?.();
    };
  }, [source, resolver]);
  return url;
};

/**
 * One full-screen viewer for photos and documents. Images render directly;
 * everything else goes through web-core's FilePreview, mounted only while
 * open so the heavy viewers never sit in the page.
 */
export const FileLightbox: React.FC<FileLightboxProps> = ({
  items,
  index,
  resolver,
  onClose,
  onIndexChange,
}) => {
  const open = index !== null && index >= 0 && index < items.length;
  const source = open ? items[index] : null;
  const isImage = source
    ? categorize(source.mimeType, source.filename) === "image"
    : false;
  const url = useResolvedUrl(source, resolver);
  const hasPrev = open && index > 0;
  const hasNext = open && index < items.length - 1;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onIndexChange(index - 1);
      if (e.key === "ArrowRight" && hasNext) onIndexChange(index + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, hasPrev, hasNext, onClose, onIndexChange]);

  if (!open || !source) return null;

  // Fades in with CSS and closes instantly. A framer-motion exit fade snapped
  // back to full opacity for one frame before unmounting (seen in a trace), so
  // there is no exit animation to flash.
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-abyss-950/95 animate-in fade-in duration-200 motion-reduce:animate-none"
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between gap-3 px-4 py-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-glow-50">
            {source.filename}
          </p>
          <p className="text-xs text-muted-foreground">
            {index + 1} of {items.length}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {url && (
            <a
              href={url}
              download={source.filename}
              className="btn-ghost h-9 px-3 py-0 text-xs"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </a>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-mist-200 transition-colors hover:bg-steel-700 hover:text-glow-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-16">
        {/* A plain, always-opaque card with no animation of its own: animating
            its scale/opacity over the overlay made Chrome drop it for a frame
            when the animation ended. Not keyed by file, so a switch swaps only
            the viewer inside it. */}
        <div
          className={
            isImage
              ? "flex max-h-full max-w-5xl items-center justify-center"
              : "flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-border bg-steel-800"
          }
          onClick={(e) => e.stopPropagation()}
        >
          {isImage ? (
            url && (
              <img
                src={url}
                alt={source.filename}
                className="max-h-[82vh] w-auto rounded-xl object-contain"
              />
            )
          ) : (
            <FilePreview
              key={source.id}
              source={source}
              resolver={resolver}
              className="fdgr-host h-full"
            />
          )}
        </div>

        {hasPrev && (
          <button
            type="button"
            aria-label="Previous file"
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange(index - 1);
            }}
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-abyss-900/70 text-mist-200 transition-colors hover:border-neon-400/60 hover:text-glow-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        {hasNext && (
          <button
            type="button"
            aria-label="Next file"
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange(index + 1);
            }}
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-abyss-900/70 text-mist-200 transition-colors hover:border-neon-400/60 hover:text-glow-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default FileLightbox;
