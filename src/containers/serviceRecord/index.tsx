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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto py-8 px-4">
          <Skeleton className="h-8 w-48 mb-8 bg-gray-200" />
          <Skeleton className="h-32 w-full mb-6 bg-gray-200 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 bg-gray-200 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-96 w-full bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto py-8 px-4">
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Failed to load service record
            </h2>
            <p className="text-gray-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Attachment Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  {attachment?.name || "Service Record"}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  {attachment?.created_at && (
                    <span className="flex items-center gap-1.5 text-sm text-gray-500">
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
                      className="bg-gray-100 text-gray-600 border-gray-200"
                    >
                      {ledgerName(attachment.ledger) || attachment.ledger}
                    </Badge>
                  )}
                  {attachment?.file_count != null && (
                    <span className="flex items-center gap-1.5 text-sm text-gray-400">
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
                  <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-400">
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
                  className="border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Transaction
                </Button>
              )}
            </div>
          </div>

          {/* Blockchain verification banner */}
          {attachment?.tx_hash && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700 font-medium">
                Verified on blockchain
              </span>
              <CopyableHash value={attachment.tx_hash} />
            </div>
          )}
        </div>

        {/* Processing state */}
        {isProcessingZip && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600 font-medium">
              Processing service record...
            </p>
            <p className="text-sm text-gray-400 mt-1">
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
