import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CopyableHash } from "@/shared/components/CopyableHash";
import { FileThumbnailButton } from "@/shared/components/FileThumbnailButton";
import { ipfsFileUrl } from "@/shared/providers/ipfs";
import { Attachment, AttachmentFileModel } from "@/shared/types/attachment";
import { createIpfsResolver } from "@/shared/utils/previewResolver";
import { getStatusConfig } from "@/shared/utils/statusConfig";
import { formatFileSize } from "@filedgr/web-core/format";
import {
  categorize,
  FilePreview,
  PreviewSource,
} from "@filedgr/web-core/preview";
import { AnimatePresence, motion } from "framer-motion";
import { Download, File, FileText, Image as ImageIcon, X } from "lucide-react";
import React, { useMemo, useState } from "react";

interface FileViewerProps {
  attachment: Attachment;
}

const isImage = (file: AttachmentFileModel) =>
  categorize(file.mimetype, file.filename) === "image";

const isPdf = (file: AttachmentFileModel) =>
  categorize(file.mimetype, file.filename) === "pdf";

const toSource = (file: AttachmentFileModel): PreviewSource => ({
  id: file.cid!,
  filename: file.filename || "document.pdf",
  mimeType: file.mimetype,
  size: file.size,
});

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const staggerItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const FileViewer: React.FC<FileViewerProps> = ({ attachment }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPdf, setSelectedPdf] = useState<PreviewSource | null>(null);
  const files = attachment.files ?? [];
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

  if (files.length === 0) {
    return (
      <div className="u-card p-12 text-center">
        <File className="w-12 h-12 text-steel-500 mx-auto mb-4" />
        <h3 className="text-lg mb-2">No files available</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
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
        className="space-y-4"
      >
        {files.map((file, index) => {
          const url = file.cid ? ipfsFileUrl(file.cid, isPublic) : null;

          return (
            <motion.div key={file.id ?? index} variants={staggerItem}>
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  {/* File header */}
                  <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-border">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 u-tile flex-shrink-0">
                        {isImage(file) ? (
                          <ImageIcon className="w-4 h-4 text-primary" />
                        ) : isPdf(file) ? (
                          <FileText className="w-4 h-4 text-red-300" />
                        ) : (
                          <File className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {file.filename || "Unnamed file"}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {file.mimetype && (
                            <Badge
                              variant="secondary"
                              className="bg-steel-700 text-mist-200 border-border text-[10px] px-1.5 py-0"
                            >
                              {file.mimetype}
                            </Badge>
                          )}
                          {file.size != null && (
                            <span className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {url && (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary hover:text-neon-300 text-xs font-medium flex-shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </a>
                    )}
                  </div>

                  {/* File preview */}
                  {isImage(file) && url && (
                    <motion.div
                      whileHover={{ scale: 1.005 }}
                      className="cursor-pointer bg-abyss-900/60 flex items-center justify-center p-4"
                      onClick={() => setSelectedImage(url)}
                    >
                      <img
                        src={url}
                        alt={file.filename || "Image"}
                        className="max-h-96 w-auto object-contain rounded-lg"
                      />
                    </motion.div>
                  )}

                  {isPdf(file) && url && (
                    <div className="bg-abyss-900/60 flex items-center justify-center p-4">
                      <div className="w-full max-w-[280px] aspect-[3/4] rounded-lg border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <FileThumbnailButton
                          source={toSource(file)}
                          resolver={resolver}
                          onOpen={() => setSelectedPdf(toSource(file))}
                        />
                      </div>
                    </div>
                  )}

                  {/* File metadata */}
                  <div className="px-5 py-3 bg-abyss-900/40 border-t border-border">
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
                      {file.hash && (
                        <span className="flex items-center gap-1.5">
                          Hash:
                          <CopyableHash value={file.hash} />
                        </span>
                      )}
                      {file.cid && (
                        <span className="flex items-center gap-1.5">
                          CID:
                          <CopyableHash value={file.cid} />
                        </span>
                      )}
                      {file.status && (
                        <span>
                          Status:{" "}
                          <span className="text-muted-foreground">
                            {getStatusConfig("attachment", file.status).label}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative max-w-5xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={selectedImage}
                alt="Full size preview"
                className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF preview modal — mounts the full pdf.js viewer only on demand */}
      <AnimatePresence>
        {selectedPdf && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedPdf(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-5xl h-[90vh] bg-steel-800 rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPdf(null)}
                className="absolute top-2 right-2 z-10 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
              <FilePreview
                source={selectedPdf}
                resolver={resolver}
                className="fdgr-host h-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileViewer;
