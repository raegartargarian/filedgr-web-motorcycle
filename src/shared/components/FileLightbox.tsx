import {
  categorize,
  FilePreview,
  PreviewSource,
  SourceResolver,
} from "@filedgr/web-core/preview";
import { AnimatePresence, motion } from "framer-motion";
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

  return (
    <AnimatePresence>
      {open && source && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex flex-col bg-abyss-950/90 backdrop-blur-sm"
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
            <motion.div
              key={source.id}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
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
                  source={source}
                  resolver={resolver}
                  className="fdgr-host h-full"
                />
              )}
            </motion.div>

            {hasPrev && (
              <button
                type="button"
                aria-label="Previous file"
                onClick={(e) => {
                  e.stopPropagation();
                  onIndexChange(index - 1);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-border bg-abyss-900/70 p-2 text-mist-200 transition-colors hover:border-neon-400/60 hover:text-glow-50"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-border bg-abyss-900/70 p-2 text-mist-200 transition-colors hover:border-neon-400/60 hover:text-glow-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FileLightbox;
