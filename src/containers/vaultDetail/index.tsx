import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { CopyableHash } from "@/shared/components/CopyableHash";
import { RecordTimeline } from "@/shared/components/RecordTimeline";
import { StatTile } from "@/shared/components/StatTile";
import { VaultCover } from "@/shared/components/VaultCover";
import { appRoutes, streamDetailPath } from "@/shared/constants/routes";
import { ledgerName } from "@/shared/utils/ledger";
import { getStatusConfig } from "@/shared/utils/statusConfig";
import { formatStreamName } from "@/shared/utils/streamHelpers";
import { viewTXInExplorer } from "@/shared/utils/viewVaultInExplorer";
import { formatDate, formatRelativeTime } from "@filedgr/web-core/format";
import {
  ArrowRight,
  Calendar,
  Download,
  ExternalLink,
  FileText,
  Layers,
  Loader2,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { generateVaultProofPdf } from "./components/generateVaultProofPdf";
import { vaultDetailSelectors } from "./selectors";
import { vaultDetailActions } from "./slice";
import { useVaultRecords } from "./useVaultRecords";

const VaultDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const vault = useSelector(vaultDetailSelectors.vault);
  const isLoading = useSelector(vaultDetailSelectors.isLoading);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [streamFilter, setStreamFilter] = useState<string | null>(null);

  const {
    records,
    totals,
    isLoading: recordsLoading,
  } = useVaultRecords(!isLoading && vault?.id === id ? vault : null);

  useEffect(() => {
    if (id) dispatch(vaultDetailActions.fetchVaultDetailStart({ id }));
  }, [dispatch, id]);

  useEffect(() => setStreamFilter(null), [id]);

  const visible = useMemo(
    () =>
      streamFilter
        ? records.filter((r) => r.streamId === streamFilter)
        : records,
    [records, streamFilter],
  );

  const handleDownloadProof = async () => {
    if (!vault || isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    try {
      await generateVaultProofPdf(vault);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (isLoading || !vault) {
    return (
      <div className="min-h-screen">
        <Skeleton className="h-[52svh] min-h-[440px] w-full rounded-none" />
        <div className="container mx-auto max-w-5xl px-4 py-8">
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-[74px] rounded-xl" />
            ))}
          </div>
          <Skeleton className="mb-3 h-16 w-full rounded-lg" />
          <Skeleton className="mb-3 h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  const streams = vault.streams ?? [];
  const vaultStatus = vault.status
    ? getStatusConfig("vault", vault.status)
    : null;
  const verifiedStreams = streams.filter((s) => s.tx_hash).length;
  const totalRecords = Object.values(totals).reduce((n, t) => n + t.total, 0);
  const newest = records[0]?.attachment.created_at;
  const filteredStream = streams.find((s) => s.id === streamFilter);
  const filteredTotals = filteredStream ? totals[filteredStream.id] : null;

  return (
    <div className="min-h-screen">
      <VaultCover
        vault={vault}
        backTo={{ to: appRoutes.vaults.path, label: "My motorcycles" }}
        eyebrow="Motorcycle"
        title={vault.name}
        subtitle={vault.description}
        meta={
          <>
            {vaultStatus && (
              <Badge variant="outline" className={vaultStatus.className}>
                {vaultStatus.label}
              </Badge>
            )}
            {vault.ledger && (
              <Badge
                variant="secondary"
                className="border-border bg-steel-700/80 text-mist-200"
              >
                {ledgerName(vault.ledger) || vault.ledger}
              </Badge>
            )}
            {vault.created_at && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Registered {formatDate(vault.created_at)}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              {streams.length} stream{streams.length !== 1 ? "s" : ""}
            </span>
          </>
        }
        actions={
          <>
            <button
              type="button"
              onClick={handleDownloadProof}
              disabled={isGeneratingPdf}
              className="btn-primary h-10 px-4 py-0 text-xs disabled:opacity-60"
            >
              {isGeneratingPdf ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
              {isGeneratingPdf ? "Generating" : "Download proof"}
            </button>
            {vault.tx_hash && (
              <button
                type="button"
                onClick={() => viewTXInExplorer(vault.tx_hash!, vault.ledger)}
                className="btn-ghost h-10 px-4 py-0 text-xs"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Explorer
              </button>
            )}
          </>
        }
      >
        {vault.tx_hash && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <ShieldCheck className="h-4 w-4 text-trellis-400" />
            <span className="font-medium text-trellis-400">
              Verified on blockchain
            </span>
            <CopyableHash value={vault.tx_hash} />
          </div>
        )}
      </VaultCover>

      <div className="container mx-auto max-w-5xl px-4 py-8 md:py-10">
        {/* Stats */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <StatTile
            icon={FileText}
            label="Service records"
            value={recordsLoading ? "…" : totalRecords}
          />
          <StatTile
            icon={Wrench}
            label="Last service"
            value={
              recordsLoading
                ? "…"
                : newest
                  ? formatRelativeTime(newest)
                  : "None yet"
            }
            tone="neutral"
          />
          <StatTile
            icon={ShieldCheck}
            label="Streams verified"
            value={`${verifiedStreams} of ${streams.length}`}
            tone="success"
          />
        </div>

        {/* Service history */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="u-eyebrow">Service history</span>
            <h2 className="u-display mt-1 text-2xl md:text-3xl">
              Every visit, on the record
            </h2>
          </div>
          {filteredStream?.asset_code && (
            <Link
              to={streamDetailPath(vault.id, filteredStream.asset_code)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-neon-300"
            >
              Open {formatStreamName(filteredStream)}
              {filteredTotals && filteredTotals.total > filteredTotals.loaded
                ? ` (all ${filteredTotals.total})`
                : ""}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {streams.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {[null, ...streams.map((s) => s.id)].map((streamId) => {
              const stream = streams.find((s) => s.id === streamId);
              const count = stream
                ? (totals[stream.id]?.total ?? 0)
                : totalRecords;
              const active = streamFilter === streamId;
              return (
                <button
                  key={streamId ?? "all"}
                  type="button"
                  onClick={() => setStreamFilter(streamId)}
                  aria-pressed={active}
                  className={cn(
                    "btn-ghost h-9 px-3.5 py-0 text-xs",
                    active &&
                      "border-neon-400/60 bg-primary/10 text-primary hover:bg-primary/15",
                  )}
                >
                  {stream ? formatStreamName(stream) : "All"}
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-[10px]",
                      active
                        ? "bg-primary/20 text-primary"
                        : "bg-steel-700 text-muted-foreground",
                    )}
                  >
                    {recordsLoading ? "…" : count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {recordsLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : visible.length > 0 ? (
          <RecordTimeline records={visible} showStream={!streamFilter} />
        ) : (
          <div className="u-card p-12 text-center">
            <Layers className="mx-auto mb-3 h-10 w-10 text-steel-500" />
            <h3 className="mb-1 text-base">No service records yet</h3>
            <p className="text-sm text-muted-foreground">
              Records will appear here once the dealership uploads repair
              documentation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VaultDetail;
