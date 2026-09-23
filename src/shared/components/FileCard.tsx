import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@filedgr/web-core/format";
import {
  categorize,
  FileThumbnail,
  PreviewSource,
  SourceResolver,
} from "@filedgr/web-core/preview";
import { File, FileText, Image as ImageIcon } from "lucide-react";
import React from "react";

interface FileCardProps {
  source: PreviewSource;
  resolver: SourceResolver;
  onOpen: () => void;
  /** Optional line under the name, e.g. a status. */
  footer?: React.ReactNode;
  className?: string;
}

const iconFor = (category: string) =>
  category === "image" ? ImageIcon : category === "pdf" ? FileText : File;

/**
 * A file tile: web-core's cached thumbnail on top, name and size below.
 * Click opens the caller's lightbox.
 */
export const FileCard: React.FC<FileCardProps> = ({
  source,
  resolver,
  onOpen,
  footer,
  className,
}) => {
  const category = categorize(source.mimeType, source.filename);
  const Icon = iconFor(category);

  return (
    <button
      type="button"
      onClick={onOpen}
      title={`Open ${source.filename}`}
      className={cn(
        "u-card group flex w-full flex-col overflow-hidden text-left transition-all hover:border-neon-400/50 hover:shadow-lg",
        className,
      )}
    >
      <div className="relative h-44 w-full overflow-hidden bg-abyss-900/60">
        <FileThumbnail
          source={source}
          resolver={resolver}
          className="h-full w-full rounded-none border-0"
        />
        <span className="absolute inset-x-0 bottom-0 bg-abyss-950/70 py-1 text-center text-[11px] text-glow-50 opacity-0 transition-opacity group-hover:opacity-100">
          Click to preview
        </span>
      </div>
      <div className="flex items-start gap-2.5 p-3">
        <div className="u-tile h-8 w-8 flex-shrink-0">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">
            {source.filename}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {source.mimeType && (
              <Badge
                variant="secondary"
                className="border-border bg-steel-700 px-1.5 py-0 text-[10px] text-mist-200"
              >
                {source.mimeType}
              </Badge>
            )}
            {source.size != null && <span>{formatFileSize(source.size)}</span>}
          </div>
          {footer}
        </div>
      </div>
    </button>
  );
};

export default FileCard;
