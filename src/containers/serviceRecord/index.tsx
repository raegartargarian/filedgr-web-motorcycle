import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CopyableHash } from "@/shared/components/CopyableHash";
import RepairVisualization from "@/shared/components/RepairVisualization";
import { cleanupRepairData } from "@/shared/utils/zipHandler";
import { ledgerName } from "@/shared/utils/ledger";
import { getStatusConfig } from "@/shared/utils/statusConfig";
import { viewTXInExplorer } from "@/shared/utils/viewVaultInExplorer";
import { formatDate, formatFileSize } from "@filedgr/web-core/format";
import {
  getFailureMessage,
  getRetryProgress,
  isPermanentFailure,
} from "@filedgr/web-core/status";
import {
  AlertCircle,
  Calendar,
  ExternalLink,
  FileText,
  HardDrive,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import FileViewer from "./components/FileViewer";
import { serviceRecordSelectors } from "./selectors";
import { serviceRecordActions } from "./slice";

const ServiceRecord = () => {
  const { attachmentId } = useParams<{ attachmentId: string }>();
  const dispatch = useDispatch();

  const attachment = useSelector(serviceRecordSelectors.attachment);
  const repairData = useSelector(serviceRecordSelectors.repairData);
  const isLoading = useSelector(serviceRecordSelectors.isLoading);
  const isProcessingZip = useSelector(serviceRecordSelectors.isProcessingZip);
  const error = useSelector(serviceRecordSelectors.error);

  const attachmentStatus = attachment?.status
    ? getStatusConfig("attachment", attachment.status)
    : null;
  const failureMessage =
    attachment?.status === "ERROR" ? getFailureMessage(attachment) : null;
  const retryProgress = failureMessage ? getRetryProgress(attachment!) : null;

  useEffect(() => {
    if (attachmentId) {
      dispatch(serviceRecordActions.fetchStart({ id: attachmentId }));
    }
    return () => {
      if (repairData) {
        cleanupRepairData(repairData);
      }
      dispatch(serviceRecordActions.reset());
    };
  }, [dispatch, attachmentId]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto py-8 px-4">
          <Skeleton className="h-8 w-48 mb-8 bg-steel-700" />
          <Skeleton className="h-32 w-full mb-6 bg-steel-700 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 bg-steel-700 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-96 w-full bg-steel-700 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto py-8 px-4">
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-12 h-12 text-red-300 mb-4" />
            <h2 className="text-xl mb-2">Failed to load service record</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Attachment Header */}
        <div className="u-card p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 u-tile rounded-xl flex-shrink-0">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl">
                  {attachment?.name || "Service Record"}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  {attachment?.created_at && (
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(attachment.created_at)}
                    </span>
                  )}
                  {attachmentStatus && (
                    <Badge
                      variant="secondary"
                      className={attachmentStatus.className}
                    >
                      {attachmentStatus.label}
                    </Badge>
                  )}
                  {attachment?.ledger && (
                    <Badge
                      variant="secondary"
                      className="bg-steel-700 text-mist-200 border-border"
                    >
                      {ledgerName(attachment.ledger) || attachment.ledger}
                    </Badge>
                  )}
                  {attachment?.file_count != null && (
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <HardDrive className="w-3.5 h-3.5" />
                      {attachment.file_count} file
                      {attachment.file_count !== 1 ? "s" : ""}
                      {attachment.size
                        ? ` (${formatFileSize(attachment.size)})`
                        : ""}
                    </span>
                  )}
                </div>
                {attachment?.stream?.asset_code && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                    <span>Stream:</span>
                    <CopyableHash value={attachment.stream.asset_code} />
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {attachment?.tx_hash && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    viewTXInExplorer(attachment.tx_hash!, attachment.ledger)
                  }
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Transaction
                </Button>
              )}
            </div>
          </div>

          {/* Processing failure, as reported by the backend's retry block */}
          {failureMessage && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
              <div className="min-w-0 text-sm">
                <p className="font-medium text-red-300">
                  {isPermanentFailure(attachment!)
                    ? "Processing failed"
                    : "Processing failed, retrying"}
                  {retryProgress &&
                    ` (attempt ${retryProgress.count} of ${retryProgress.max})`}
                </p>
                <p className="mt-0.5 break-words text-mist-200">
                  {failureMessage}
                </p>
              </div>
            </div>
          )}

          {/* Blockchain verification banner */}
          {attachment?.tx_hash && (
            <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-trellis-400" />
              <span className="text-sm text-trellis-400 font-medium">
                Verified on blockchain
              </span>
              <CopyableHash value={attachment.tx_hash} />
            </div>
          )}
        </div>

        {/* Processing state */}
        {isProcessingZip && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-mist-200 font-medium">
              Processing service record...
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Extracting repair data, photos, and documents
            </p>
          </div>
        )}

        {/* Repair Visualization */}
        {repairData && <RepairVisualization data={repairData} />}

        {/* Non-zip file viewer */}
        {!isProcessingZip && !repairData && attachment && (
          <FileViewer attachment={attachment} />
        )}
      </div>
    </div>
  );
};

export default ServiceRecord;
