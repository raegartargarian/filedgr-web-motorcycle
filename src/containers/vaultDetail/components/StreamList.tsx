import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getStreamAttachments } from "@/shared/providers/api";
import { readListPage } from "@/shared/utils/listPage";
import { streamDetailPath } from "@/shared/constants/routes";
import { VaultStreamDto } from "@/shared/types/vault";
import { getStatusConfig } from "@/shared/utils/statusConfig";
import { formatStreamName } from "@/shared/utils/streamHelpers";
import { ArrowRight, Layers, ShieldCheck } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ServiceRecordCard from "./ServiceRecordCard";
import { Attachment } from "../types";

// How many records to show inline per stream before linking to the full page.
const PREVIEW_COUNT = 3;

interface StreamListProps {
  vaultId: string;
  streams: VaultStreamDto[];
}

interface StreamPreview {
  previews: Attachment[];
  total: number;
}

const StreamList: React.FC<StreamListProps> = ({ vaultId, streams }) => {
  const navigate = useNavigate();
  // streamId -> { first few records, true total }, loaded in parallel up front.
  const [previewsByStream, setPreviewsByStream] = useState<
    Record<string, StreamPreview>
  >({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadAll = async () => {
      setIsLoading(true);
      const entries = await Promise.all(
        streams.map(async (stream) => {
          const empty: StreamPreview = { previews: [], total: 0 };
          if (!stream.asset_code) return [stream.id, empty] as const;
          try {
            const res = await getStreamAttachments(
              stream.asset_code,
              1,
              PREVIEW_COUNT,
            );
            const { content, total_records } = readListPage<Attachment>(res, 1);
            return [
              stream.id,
              { previews: content, total: total_records },
            ] as const;
          } catch (error) {
            console.error("Failed to load attachments:", error);
            return [stream.id, empty] as const;
          }
        }),
      );

      if (cancelled) return;
      setPreviewsByStream(Object.fromEntries(entries));
      setIsLoading(false);
    };

    loadAll();
    return () => {
      cancelled = true;
    };
  }, [streams]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: Math.min(streams.length || 3, 4) }).map(
          (_, i) => (
            <Skeleton key={i} className="h-44 w-full bg-steel-700 rounded-xl" />
          ),
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {streams.map((stream) => {
        const { previews, total } = previewsByStream[stream.id] ?? {
          previews: [],
          total: 0,
        };
        const status = stream.status
          ? getStatusConfig("stream", stream.status)
          : null;
        const hasMore = total > previews.length;

        return (
          <div key={stream.id} className="u-card overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-border">
              <div className="w-9 h-9 u-tile flex-shrink-0">
                <Layers className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm">{formatStreamName(stream)}</h3>
                <span className="text-xs text-muted-foreground">
                  {total} record{total !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {status && (
                  <Badge
                    variant="secondary"
                    className={`text-[10px] px-1.5 py-0 ${status.className}`}
                  >
                    {status.label}
                  </Badge>
                )}
                {stream.tx_hash && (
                  <ShieldCheck className="w-4 h-4 text-trellis-400" />
                )}
              </div>
            </div>

            {/* Preview records */}
            <div className="p-4">
              {stream.description && (
                <p className="text-xs text-muted-foreground mb-3">
                  {stream.description}
                </p>
              )}
              {previews.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">
                  No service records uploaded yet
                </p>
              ) : (
                <div className="space-y-2">
                  {previews.map((attachment) => (
                    <ServiceRecordCard
                      key={attachment.id}
                      attachment={attachment}
                    />
                  ))}
                </div>
              )}

              {hasMore && stream.asset_code && (
                <button
                  onClick={() =>
                    navigate(streamDetailPath(vaultId, stream.asset_code!))
                  }
                  className="mt-3 w-full flex items-center justify-center gap-1.5 text-sm font-medium text-primary hover:text-neon-300 hover:bg-primary/10 rounded-lg py-2 transition-colors"
                >
                  View all {total} records
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StreamList;
