import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { appRoutes } from "@/shared/constants/routes";
import {
  ARCHIVED_BADGE_CLASS,
  getStatusConfig,
} from "@/shared/utils/statusConfig";
import { formatDate } from "@filedgr/web-core/format";
import { categorize } from "@filedgr/web-core/preview";
import {
  Archive,
  ArrowRight,
  Calendar,
  FileText,
  Image as ImageIcon,
  Package,
  Wrench,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Attachment } from "../types";

interface ServiceRecordCardProps {
  attachment: Attachment;
  /** Pill naming the stream, for lists that mix streams. */
  streamLabel?: string;
  /** On a timeline the rail shows the date, so the card hides its own on wide screens. */
  inTimeline?: boolean;
}

const ServiceRecordCard: React.FC<ServiceRecordCardProps> = ({
  attachment,
  streamLabel,
  inTimeline = false,
}) => {
  const navigate = useNavigate();
  const status = attachment.status
    ? getStatusConfig("attachment", attachment.status)
    : null;

  const categories = (attachment.files ?? []).map((f) =>
    categorize(f.mimetype, f.filename),
  );
  const hasZip = categories.includes("zip");

  const handleClick = () => {
    navigate(`${appRoutes.serviceRecord.name}${attachment.id}`);
  };

  // Compute file type summary
  const fileTypeSummary = (() => {
    if (categories.length === 0) return null;
    let images = 0,
      pdfs = 0,
      zips = 0,
      other = 0;
    for (const category of categories) {
      if (category === "image") images++;
      else if (category === "pdf") pdfs++;
      else if (category === "zip") zips++;
      else other++;
    }
    const parts: string[] = [];
    if (zips > 0) parts.push(`${zips} ZIP`);
    if (images > 0) parts.push(`${images} image${images > 1 ? "s" : ""}`);
    if (pdfs > 0) parts.push(`${pdfs} PDF${pdfs > 1 ? "s" : ""}`);
    if (other > 0) parts.push(`${other} other`);
    return parts.join(", ");
  })();

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full text-left u-card p-4 hover:shadow-md hover:border-neon-400/50 transition-all duration-200 cursor-pointer group",
        attachment.archived && "opacity-60 hover:opacity-100",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 u-tile flex-shrink-0">
            {hasZip ? (
              <Wrench className="w-4 h-4 text-primary" />
            ) : categories.includes("image") ? (
              <ImageIcon className="w-4 h-4 text-primary" />
            ) : (
              <FileText className="w-4 h-4 text-primary" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground truncate text-sm">
              {attachment.name || "Service Record"}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-0.5">
              {attachment.created_at && (
                <span
                  className={cn(
                    "flex items-center gap-1 text-xs text-muted-foreground",
                    inTimeline && "md:hidden",
                  )}
                >
                  <Calendar className="w-3 h-3" />
                  {formatDate(attachment.created_at)}
                </span>
              )}
              {fileTypeSummary && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Package className="w-3 h-3" />
                  {fileTypeSummary}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {streamLabel && (
            <Badge
              variant="secondary"
              className="hidden border-border bg-steel-700 text-[11px] text-mist-200 sm:inline-flex"
            >
              {streamLabel}
            </Badge>
          )}
          {attachment.archived && (
            <Badge
              variant="secondary"
              className={`text-xs ${ARCHIVED_BADGE_CLASS}`}
            >
              <Archive className="w-3 h-3 mr-1" />
              Archived
            </Badge>
          )}
          {status && (
            <Badge
              variant="secondary"
              className={`text-xs hidden sm:inline-flex ${status.className}`}
            >
              {status.label}
            </Badge>
          )}
          <ArrowRight className="w-4 h-4 text-steel-500 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </button>
  );
};

export default ServiceRecordCard;
