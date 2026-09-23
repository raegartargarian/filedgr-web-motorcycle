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
      className="u-card group flex h-full w-full cursor-pointer flex-col overflow-hidden text-left transition-all duration-200 hover:border-neon-400/50 hover:shadow-lg"
    >
      {/* Top half: vault image (with graceful fallback) */}
      <div className="relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br from-steel-700 to-abyss-900">
        <VaultImage
          vault={vault}
          imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          iconClassName="w-10 h-10 text-steel-500"
        />

        {status && (
          <Badge
            variant="outline"
            className={`absolute right-2 top-2 px-2 py-0.5 text-[10px] ${status.className}`}
          >
            {status.label}
          </Badge>
        )}
      </div>

      {/* Bottom: details */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-3 truncate text-base transition-colors group-hover:text-primary">
          {vault.name}
        </h3>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {vault.created_at && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(vault.created_at)}
              </span>
            )}
            {vault.streams && vault.streams.length > 0 && (
              <span className="flex items-center gap-1">
                <Layers className="h-3 w-3" />
                {vault.streams.length}
              </span>
            )}
          </div>
          <ArrowRight className="h-4 w-4 text-steel-500 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
        </div>
      </div>
    </button>
  );
};

export default VaultItem;
