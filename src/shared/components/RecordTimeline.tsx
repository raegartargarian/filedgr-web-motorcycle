import ServiceRecordCard from "@/containers/vaultDetail/components/ServiceRecordCard";
import { Attachment } from "@/shared/types/attachment";
import { motion } from "framer-motion";
import React from "react";

export interface TimelineRecord {
  attachment: Attachment;
  /** Shown as a pill on the card when records come from several streams. */
  streamLabel?: string;
  streamId?: string;
}

interface RecordTimelineProps {
  records: TimelineRecord[];
  /** Whether to render each record's stream pill. */
  showStream?: boolean;
}

const MONTH = new Intl.DateTimeFormat("en", { month: "short" });
const MONTH_YEAR = new Intl.DateTimeFormat("en", {
  month: "long",
  year: "numeric",
});

const toDate = (value?: string) => {
  if (!value) return null;
  const d = new Date(value.endsWith("Z") ? value : `${value}Z`);
  return Number.isNaN(d.getTime()) ? null : d;
};

/**
 * Records in date order on a vertical rail: the day sits in the left column,
 * a neon dot marks each entry, and consecutive months get a small header.
 */
export const RecordTimeline: React.FC<RecordTimelineProps> = ({
  records,
  showStream = false,
}) => {
  let lastMonth = "";

  return (
    <ol className="relative ml-2 list-none border-l border-border p-0 md:ml-20">
      {records.map(({ attachment, streamLabel }, i) => {
        const date = toDate(attachment.created_at);
        const month = date ? MONTH_YEAR.format(date) : "Undated";
        const header = month !== lastMonth ? month : null;
        lastMonth = month;

        return (
          <motion.li
            key={attachment.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(i, 8) * 0.05 }}
            className="relative pb-4 pl-6 md:pl-8"
          >
            {header && (
              <div className="u-eyebrow mb-3 mt-1 first:mt-0">{header}</div>
            )}
            <span className="absolute -left-[5px] top-[calc(1.25rem)] h-[9px] w-[9px] rounded-full bg-primary shadow-glow" />
            {date && (
              <div className="absolute -left-20 top-2 hidden w-14 text-right md:block">
                <div className="u-display text-2xl leading-none">
                  {date.getDate()}
                </div>
                <div className="u-eyebrow mt-0.5">{MONTH.format(date)}</div>
              </div>
            )}
            <ServiceRecordCard
              attachment={attachment}
              streamLabel={showStream ? streamLabel : undefined}
              inTimeline
            />
          </motion.li>
        );
      })}
    </ol>
  );
};

export default RecordTimeline;
