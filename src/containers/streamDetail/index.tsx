import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CopyableHash } from "@/shared/components/CopyableHash";
import { LoadingIndicator } from "@/shared/components/LoadingIndicator";
import { cn } from "@/lib/utils";
import { getStreamAttachments } from "@/shared/providers/api";
import { readListPage } from "@/shared/utils/listPage";
import { ledgerName } from "@/shared/utils/ledger";
import { getStatusConfig } from "@/shared/utils/statusConfig";
import { formatStreamName } from "@/shared/utils/streamHelpers";
import { viewTXInExplorer } from "@/shared/utils/viewVaultInExplorer";
import { formatDate } from "@filedgr/web-core/format";
import { useInfiniteScroll } from "@filedgr/web-core/react";
import {
  Archive,
  Calendar,
  ExternalLink,
  FileText,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { archivedCountOf } from "./archivedCount";
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

  // Archived records are out of the list by default. Asking for them adds
  // them to the list — the backend has no archived-only view — and every fetch
  // on this page has to ask the same way, or paging would mix two lists.
  const [showArchived, setShowArchived] = useState(false);
  // How many there are to show, which decides whether to offer the toggle at
  // all: a stream with nothing archived should not advertise a view of
  // nothing. Null until counted; a failed count keeps the last answer.
  const [archivedCount, setArchivedCount] = useState<number | null>(null);
  const archivedFilter = showArchived ? true : undefined;

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
    getStreamAttachments(code, 1, PAGE_SIZE, archivedFilter)
      .then((res) => {
        if (cancelled) return;
        const first = readListPage<Attachment>(res, 1);
        setAttachments(first.content);
        setPage(first.current_page);
        setTotalPages(first.total_pages);
        setTotalRecords(first.total_records);
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
  }, [code, archivedFilter]);

  // Counted on the same occasions the list is loaded, and never as part of
  // the list request, because it is two extra one-item pages the list itself
  // does not need.
  useEffect(() => {
    if (!code) return;
    let cancelled = false;
    Promise.all([
      getStreamAttachments(code, 1, 1, true),
      getStreamAttachments(code, 1, 1),
    ])
      .then(([everything, liveOnly]) => {
        if (cancelled) return;
        const count = archivedCountOf(everything, liveOnly);
        if (count !== null) setArchivedCount(count);
      })
      .catch((error) => {
        // Best effort: the toggle simply does not appear until a count lands.
        console.error("Failed to count archived records:", error);
      });
    return () => {
      cancelled = true;
    };
  }, [code, archivedFilter]);

  const loadMore = useCallback(async () => {
    if (isFetching || !hasMore || !code) return;
    const next = page + 1;
    setIsFetching(true);
    try {
      const res = await getStreamAttachments(
        code,
        next,
        PAGE_SIZE,
        archivedFilter,
      );
      const loaded = readListPage<Attachment>(res, next);
      setAttachments((prev) => [...prev, ...loaded.content]);
      setPage(loaded.current_page);
      setTotalPages(loaded.total_pages);
    } catch (error) {
      console.error("Failed to load attachments:", error);
    } finally {
      setIsFetching(false);
    }
  }, [code, page, hasMore, isFetching, archivedFilter]);

  const sentinelRef = useInfiniteScroll({
    hasMore,
    isLoading: isFetching,
    onLoadMore: loadMore,
  });

  // Offered once there is something to show — or while it is on, so the
  // toggle does not vanish from under the cursor.
  const offerArchived = (archivedCount ?? 0) > 0 || showArchived;

  const isFirstLoad = isFetching && attachments.length === 0;
  const status = stream?.status
    ? getStatusConfig("stream", stream.status)
    : null;

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Stream header */}
        <div className="u-card p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 u-tile rounded-xl flex-shrink-0">
              <Layers className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl truncate">
                {stream ? formatStreamName(stream) : "Service Stream"}
              </h1>
              {stream?.description && (
                <p className="text-sm text-muted-foreground mt-1">
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
                    className="bg-steel-700 text-mist-200 border-border"
                  >
                    {ledgerName(stream.ledger) || stream.ledger}
                  </Badge>
                )}
                {stream?.created_at && (
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    Created {formatDate(stream.created_at)}
                  </span>
                )}
                {totalRecords != null && (
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <FileText className="w-3.5 h-3.5" />
                    {totalRecords} record{totalRecords !== 1 ? "s" : ""}
                  </span>
                )}
                {offerArchived && (
                  <Button
                    variant="outline"
                    size="sm"
                    aria-pressed={showArchived}
                    onClick={() => setShowArchived((on) => !on)}
                    title="Archived records stay in the vault, out of the way. Show them alongside the rest."
                    className={cn(
                      "h-7",
                      showArchived &&
                        "border-gold-400/40 bg-gold-400/10 text-gold-300 hover:bg-gold-400/20 hover:text-gold-300",
                    )}
                  >
                    <Archive className="w-3.5 h-3.5 mr-1.5" />
                    Show archived
                    {archivedCount != null && ` (${archivedCount})`}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {(stream?.tx_hash || stream?.asset_code) && (
            <>
              <Separator className="my-5" />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  {stream?.tx_hash && (
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-trellis-400" />
                      <span className="text-sm text-trellis-400 font-medium">
                        Verified on blockchain
                      </span>
                      <CopyableHash value={stream.tx_hash} />
                    </div>
                  )}
                  {stream?.asset_code && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
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
                    className="w-fit"
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
                className="h-16 w-full bg-steel-700 rounded-lg"
              />
            ))}
          </div>
        ) : attachments.length === 0 ? (
          <div className="u-card p-12 text-center">
            <Layers className="w-10 h-10 text-steel-500 mx-auto mb-3" />
            <h3 className="text-base mb-1">No service records yet</h3>
            <p className="text-sm text-muted-foreground">
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
