import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CopyableHash } from "@/shared/components/CopyableHash";
import { LoadingIndicator } from "@/shared/components/LoadingIndicator";
import { getStreamAttachments } from "@/shared/providers/api";
import { ledgerName } from "@/shared/utils/ledger";
import { getStatusConfig } from "@/shared/utils/statusConfig";
import { formatStreamName } from "@/shared/utils/streamHelpers";
import { viewTXInExplorer } from "@/shared/utils/viewVaultInExplorer";
import { formatDate } from "@filedgr/web-core/format";
import { useInfiniteScroll } from "@filedgr/web-core/react";
import {
  Calendar,
  ExternalLink,
  FileText,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ServiceRecordCard from "../vaultDetail/components/ServiceRecordCard";
import { vaultDetailSelectors } from "../vaultDetail/selectors";
import { vaultDetailActions } from "../vaultDetail/slice";
import { Attachment } from "../vaultDetail/types";

const PAGE_SIZE = 15;

const StreamDetail = () => {
  const { id, code } = useParams<{ id: string; code: string }>();
  const dispatch = useDispatch();
  const vault = useSelector(vaultDetailSelectors.vault);

  // Ensure the vault is loaded so the header can show stream metadata
  // (name, status, verification) — e.g. on a hard refresh / deep link.
  useEffect(() => {
    if (id && vault?.id !== id) {
      dispatch(vaultDetailActions.fetchVaultDetailStart({ id }));
    }
  }, [id, vault?.id, dispatch]);

  const stream = vault?.streams?.find((s) => s.asset_code === code);

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [totalRecords, setTotalRecords] = useState<number | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  // null totalPages = not yet loaded; treat as "no more" until the first page
  // resolves so the sentinel doesn't fire before we know the page count.
  const hasMore = totalPages !== null && page < totalPages;

  // Reset + load the first page whenever the stream changes.
  useEffect(() => {
    if (!code) return;
    let cancelled = false;
    setAttachments([]);
    setPage(0);
    setTotalPages(null);
    setTotalRecords(null);
    setIsFetching(true);
    getStreamAttachments(code, 1, PAGE_SIZE)
      .then((res) => {
        if (cancelled) return;
        setAttachments(res.data?.content || []);
        setPage(res.data?.current_page ?? 1);
        setTotalPages(res.data?.total_pages ?? 1);
        setTotalRecords(res.data?.total_records ?? null);
      })
      .catch((error) => {
        if (!cancelled) console.error("Failed to load attachments:", error);
      })
      .finally(() => {
        if (!cancelled) setIsFetching(false);
      });
    return () => {
      cancelled = true;
    };
  }, [code]);

  const loadMore = useCallback(async () => {
    if (isFetching || !hasMore || !code) return;
    const next = page + 1;
    setIsFetching(true);
    try {
      const res = await getStreamAttachments(code, next, PAGE_SIZE);
      setAttachments((prev) => [...prev, ...(res.data?.content || [])]);
      setPage(res.data?.current_page ?? next);
      setTotalPages(res.data?.total_pages ?? totalPages);
    } catch (error) {
      console.error("Failed to load attachments:", error);
    } finally {
      setIsFetching(false);
    }
  }, [code, page, hasMore, isFetching, totalPages]);

  const sentinelRef = useInfiniteScroll({
    hasMore,
    isLoading: isFetching,
    onLoadMore: loadMore,
  });

  const isFirstLoad = isFetching && attachments.length === 0;
  const status = stream?.status
    ? getStatusConfig("stream", stream.status)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Stream header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
              <Layers className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
                {stream ? formatStreamName(stream) : "Service Stream"}
              </h1>
              {stream?.description && (
                <p className="text-sm text-gray-500 mt-1">
                  {stream.description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3 mt-3">
                {status && (
                  <Badge variant="secondary" className={status.className}>
                    {status.label}
                  </Badge>
                )}
                {stream?.ledger && (
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 text-gray-600 border-gray-200"
                  >
                    {ledgerName(stream.ledger) || stream.ledger}
                  </Badge>
                )}
                {stream?.created_at && (
                  <span className="flex items-center gap-1.5 text-sm text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    Created {formatDate(stream.created_at)}
                  </span>
                )}
                {totalRecords != null && (
                  <span className="flex items-center gap-1.5 text-sm text-gray-400">
                    <FileText className="w-3.5 h-3.5" />
                    {totalRecords} record{totalRecords !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>

          {(stream?.tx_hash || stream?.asset_code) && (
            <>
              <Separator className="my-5 bg-gray-100" />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  {stream?.tx_hash && (
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700 font-medium">
                        Verified on blockchain
                      </span>
                      <CopyableHash value={stream.tx_hash} />
                    </div>
                  )}
                  {stream?.asset_code && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <span>Stream:</span>
                      <CopyableHash value={stream.asset_code} />
                    </div>
                  )}
                </div>
                {stream?.tx_hash && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      viewTXInExplorer(stream.tx_hash!, stream.ledger)
                    }
                    className="border-gray-200 text-gray-600 hover:bg-gray-50 w-fit"
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                    Explorer
                  </Button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Records */}
        {isFirstLoad ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-16 w-full bg-gray-100 rounded-lg"
              />
            ))}
          </div>
        ) : attachments.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <Layers className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              No service records yet
            </h3>
            <p className="text-sm text-gray-500">
              Records will appear here once the dealership uploads
              documentation.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {attachments.map((attachment) => (
                <ServiceRecordCard
                  key={attachment.id}
                  attachment={attachment}
                />
              ))}
            </div>
            {hasMore && (
              <div ref={sentinelRef} aria-hidden className="h-px w-full" />
            )}
            {isFetching && attachments.length > 0 && (
              <div className="w-full flex items-center justify-center mt-6">
                <LoadingIndicator />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StreamDetail;
