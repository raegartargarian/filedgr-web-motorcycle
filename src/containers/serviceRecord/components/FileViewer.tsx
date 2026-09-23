import { CopyableHash } from "@/shared/components/CopyableHash";
import { FileCard } from "@/shared/components/FileCard";
import { FileLightbox } from "@/shared/components/FileLightbox";
import { Attachment, AttachmentFileModel } from "@/shared/types/attachment";
import { createIpfsResolver } from "@/shared/utils/previewResolver";
import { PreviewSource } from "@filedgr/web-core/preview";
import { motion } from "framer-motion";
import { ChevronDown, File } from "lucide-react";
import React, { useMemo, useState } from "react";

interface FileViewerProps {
  attachment: Attachment;
}

const toSource = (file: AttachmentFileModel, index: number): PreviewSource => ({
  id: file.cid ?? `${index}`,
  filename: file.filename || "file",
  mimeType: file.mimetype,
  size: file.size ?? undefined,
});

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const staggerItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

/** Files of a plain (non-repair) record: a thumbnail grid with one lightbox. */
const FileViewer: React.FC<FileViewerProps> = ({ attachment }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const files = (attachment.files ?? []).filter((f) => f.cid);
  const isPublic = attachment.public_vault !== false;
  const resolver = useMemo(
    () =>
      createIpfsResolver({
        isPublic,
        txHash: attachment.tx_hash,
        ledger: attachment.ledger,
      }),
    [isPublic, attachment.tx_hash, attachment.ledger],
  );
  const sources = useMemo(() => files.map(toSource), [files]);

  if (files.length === 0) {
    return (
      <div className="u-card p-12 text-center">
        <File className="mx-auto mb-4 h-12 w-12 text-steel-500" />
        <h3 className="mb-2 text-lg">No files available</h3>
        <p className="mx-auto max-w-md text-muted-foreground">
          This service record does not contain any viewable files.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {sources.map((source, index) => (
          <motion.div key={source.id} variants={staggerItem}>
            <FileCard
              source={source}
              resolver={resolver}
              onOpen={() => setOpenIndex(index)}
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="u-card overflow-hidden">
        <button
          type="button"
          onClick={() => setShowDetails((on) => !on)}
          aria-expanded={showDetails}
          className="flex w-full items-center justify-between px-4 py-3 text-sm text-mist-200 transition-colors hover:text-glow-50"
        >
          File details
          <ChevronDown
            className={`h-4 w-4 transition-transform ${showDetails ? "rotate-180" : ""}`}
          />
        </button>
        {showDetails && (
          <div className="divide-y divide-border border-t border-border">
            {files.map((file, index) => (
              <div
                key={file.cid ?? index}
                className="flex flex-wrap items-center gap-x-6 gap-y-1 px-4 py-2.5 text-xs text-muted-foreground"
              >
                <span className="min-w-0 flex-1 truncate text-mist-100">
                  {file.filename}
                </span>
                {file.hash && (
                  <span className="flex items-center gap-1.5">
                    Hash <CopyableHash value={file.hash} />
                  </span>
                )}
                {file.cid && (
                  <span className="flex items-center gap-1.5">
                    CID <CopyableHash value={file.cid} />
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <FileLightbox
        items={sources}
        index={openIndex}
        resolver={resolver}
        onClose={() => setOpenIndex(null)}
        onIndexChange={setOpenIndex}
      />
    </div>
  );
};

export default FileViewer;
