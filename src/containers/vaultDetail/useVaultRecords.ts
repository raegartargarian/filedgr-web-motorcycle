import { getStreamAttachments, PAGE_SIZE } from "@/shared/providers/api";
import { TimelineRecord } from "@/shared/components/RecordTimeline";
import { VaultDto, VaultStreamDto } from "@/shared/types/vault";
import { readListPage } from "@/shared/utils/listPage";
import { formatStreamName } from "@/shared/utils/streamHelpers";
import { useEffect, useState } from "react";
import { Attachment } from "./types";

export interface StreamTotals {
  total: number;
  loaded: number;
}

export interface VaultRecords {
  /** Newest first, across every stream. */
  records: TimelineRecord[];
  /** Per stream id: how many records exist and how many are in `records`. */
  totals: Record<string, StreamTotals>;
  isLoading: boolean;
}

const time = (value?: string) => (value ? Date.parse(value) || 0 : 0);

/** Merges every stream's records into one list, newest first. */
export const mergeRecords = (
  pages: Array<{ stream: VaultStreamDto; content: Attachment[] }>,
): TimelineRecord[] =>
  pages
    .flatMap(({ stream, content }) =>
      content.map((attachment) => ({
        attachment,
        streamLabel: formatStreamName(stream),
        streamId: stream.id,
      })),
    )
    .sort(
      (a, b) => time(b.attachment.created_at) - time(a.attachment.created_at),
    );

/**
 * The first page of every stream on the vault, loaded in parallel and merged
 * into one timeline. Streams with more records than one page report it in
 * `totals` so the page can link to the full stream view.
 */
export const useVaultRecords = (vault: VaultDto | null): VaultRecords => {
  const [state, setState] = useState<VaultRecords>({
    records: [],
    totals: {},
    isLoading: true,
  });
  const streams = vault?.streams ?? [];
  const key = streams.map((s) => s.id).join(",");

  useEffect(() => {
    let cancelled = false;
    if (streams.length === 0) {
      setState({ records: [], totals: {}, isLoading: false });
      return;
    }
    setState((prev) => ({ ...prev, isLoading: true }));

    Promise.all(
      streams.map(async (stream) => {
        if (!stream.asset_code) return { stream, content: [], total: 0 };
        try {
          const res = await getStreamAttachments(
            stream.asset_code,
            1,
            PAGE_SIZE,
          );
          const page = readListPage<Attachment>(res, 1);
          return { stream, content: page.content, total: page.total_records };
        } catch (error) {
          console.error("Failed to load attachments:", error);
          return { stream, content: [], total: 0 };
        }
      }),
    ).then((pages) => {
      if (cancelled) return;
      const totals: Record<string, StreamTotals> = {};
      for (const { stream, content, total } of pages) {
        totals[stream.id] = { total, loaded: content.length };
      }
      setState({ records: mergeRecords(pages), totals, isLoading: false });
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return state;
};
