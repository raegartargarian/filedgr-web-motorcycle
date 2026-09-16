import { Badge } from "@/components/ui/badge";
import { appRoutes } from "@/shared/constants/routes";
import { getStatusConfig } from "@/shared/utils/statusConfig";
import { formatDate } from "@filedgr/web-core/format";
import { categorize } from "@filedgr/web-core/preview";
import {
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
}

const ServiceRecordCard: React.FC<ServiceRecordCardProps> = ({
  attachment,
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
      className="w-full text-left bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
            {hasZip ? (
              <Wrench className="w-4 h-4 text-blue-600" />
            ) : categories.includes("image") ? (
              <ImageIcon className="w-4 h-4 text-blue-600" />
            ) : (
              <FileText className="w-4 h-4 text-blue-600" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate text-sm">
              {attachment.name || "Service Record"}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-0.5">
              {attachment.created_at && (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  {formatDate(attachment.created_at)}
                </span>
              )}
              {fileTypeSummary && (
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Package className="w-3 h-3" />
                  {fileTypeSummary}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {status && (
            <Badge
              variant="secondary"
              className={`text-xs hidden sm:inline-flex ${status.className}`}
            >
              {status.label}
            </Badge>
          )}
          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </button>
  );
};

export default ServiceRecordCard;
