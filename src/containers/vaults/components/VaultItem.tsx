import { Badge } from "@/components/ui/badge";
import { VaultImage } from "@/shared/components/VaultImage";
import { appRoutes } from "@/shared/constants/routes";
import { VaultDto } from "@/shared/types/vault";
import { ledgerName } from "@/shared/utils/ledger";
import { getStatusConfig } from "@/shared/utils/statusConfig";
import { formatDate } from "@filedgr/web-core/format";
import { ArrowRight, Calendar, Layers, Link2 } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

interface VaultItemProps {
  vault: VaultDto;
}

/** One motorcycle as a showcase card (two per row on wide screens), its photo as the backdrop. */
const VaultItem: React.FC<VaultItemProps> = ({ vault }) => {
  const status = vault.status ? getStatusConfig("vault", vault.status) : null;
  const streamCount = vault.streams?.length ?? 0;

  return (
    <Link
      to={`${appRoutes.vaultDetail.name}${vault.id}`}
      className="group relative block h-[44svh] min-h-[340px] overflow-hidden rounded-2xl border border-border bg-abyss-900 transition-all duration-300 hover:border-neon-400/50 hover:shadow-glow"
    >
      <div className="absolute inset-0">
        <VaultImage
          vault={vault}
          imgClassName="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          iconClassName="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 text-steel-500/50"
        />
        <div className="absolute inset-0 u-scrim" />
        <div className="absolute inset-0 u-vignette" />
      </div>

      {status && (
        <Badge
          variant="outline"
          className={`absolute left-5 top-5 px-2.5 py-0.5 text-[11px] ${status.className}`}
        >
          {status.label}
        </Badge>
      )}

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-5 md:p-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <h2 className="u-display text-3xl leading-[1.05] lg:text-4xl">
            {vault.name}
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-mist-200">
            {vault.created_at && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                Registered {formatDate(vault.created_at)}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-muted-foreground" />
              {streamCount} stream{streamCount !== 1 ? "s" : ""}
            </span>
            {vault.ledger && (
              <span className="flex items-center gap-1.5">
                <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
                {ledgerName(vault.ledger) || vault.ledger}
              </span>
            )}
          </div>
        </div>
        <span className="btn-primary h-10 flex-shrink-0 self-start px-4 py-0 text-xs xl:self-auto">
          Open service history
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
};

export default VaultItem;
