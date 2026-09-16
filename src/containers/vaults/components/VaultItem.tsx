import { Badge } from "@/components/ui/badge";
import { VaultImage } from "@/shared/components/VaultImage";
import { appRoutes } from "@/shared/constants/routes";
import { VaultDto } from "@/shared/types/vault";
import { getStatusConfig } from "@/shared/utils/statusConfig";
import { formatDate } from "@filedgr/web-core/format";
import { ArrowRight, Calendar, Layers } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

interface VaultItemProps {
  vault: VaultDto;
}

const VaultItem: React.FC<VaultItemProps> = ({ vault }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`${appRoutes.vaultDetail.name}${vault.id}`);
  };

  const status = vault.status ? getStatusConfig("vault", vault.status) : null;

  return (
    <button
      onClick={handleClick}
      className="w-full h-full flex flex-col text-left bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer group overflow-hidden"
    >
      {/* Top half: vault image (with graceful fallback) */}
      <div className="relative h-32 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center overflow-hidden">
        <VaultImage
          vault={vault}
          imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          iconClassName="w-10 h-10 text-blue-300"
        />

        {/* Status overlay */}
        {status && (
          <Badge
            variant="secondary"
            className={`absolute top-2 right-2 text-[10px] px-2 py-0.5 shadow-sm ${status.className}`}
          >
            {status.label}
          </Badge>
        )}
      </div>

      {/* Bottom: details */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-semibold text-gray-900 truncate text-base group-hover:text-blue-600 transition-colors mb-3">
          {vault.name}
        </h3>

        {/* Footer: Meta + Arrow */}
        <div className="flex items-center justify-between pt-3 mt-auto border-t border-gray-100">
          <div className="flex items-center gap-3">
            {vault.created_at && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar className="w-3 h-3" />
                {formatDate(vault.created_at)}
              </span>
            )}
            {vault.streams && vault.streams.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Layers className="w-3 h-3" />
                {vault.streams.length}
              </span>
            )}
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </button>
  );
};

export default VaultItem;
