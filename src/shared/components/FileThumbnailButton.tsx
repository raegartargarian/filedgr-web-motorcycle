import {
  FileThumbnail,
  PreviewSource,
  SourceResolver,
} from "@filedgr/web-core/preview";

/**
 * A clickable file tile: web-core's lazy, cached thumbnail (first PDF page,
 * image, …) with a "click to preview" hint. Clicking calls `onOpen` so the
 * caller mounts the heavy viewer in a modal, keeping at most one alive at a
 * time on resource-constrained tablets. Fills its parent — size the wrapper.
 */
export const FileThumbnailButton = ({
  source,
  resolver,
  onOpen,
  className = "",
}: {
  source: PreviewSource;
  resolver: SourceResolver;
  onOpen: () => void;
  className?: string;
}) => (
  <button
    type="button"
    onClick={onOpen}
    className={`group relative block w-full h-full overflow-hidden bg-steel-800 cursor-zoom-in ${className}`}
    title={`Open ${source.filename}`}
  >
    <FileThumbnail
      source={source}
      resolver={resolver}
      className="w-full h-full rounded-none border-0"
    />
    <span className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-[11px] py-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
      Click to preview
    </span>
  </button>
);
