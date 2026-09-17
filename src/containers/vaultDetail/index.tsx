import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CopyableHash } from "@/shared/components/CopyableHash";
import { VaultImage } from "@/shared/components/VaultImage";
import { ledgerName } from "@/shared/utils/ledger";
import { viewTXInExplorer } from "@/shared/utils/viewVaultInExplorer";
import {
  Calendar,
  Download,
  ExternalLink,
  Layers,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getStatusConfig } from "@/shared/utils/statusConfig";
import { formatDate } from "@filedgr/web-core/format";
import { generateVaultProofPdf } from "./components/generateVaultProofPdf";
import StreamList from "./components/StreamList";
import { vaultDetailSelectors } from "./selectors";
import { vaultDetailActions } from "./slice";

const VaultDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const vault = useSelector(vaultDetailSelectors.vault);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const isLoading = useSelector(vaultDetailSelectors.isLoading);

  const handleDownloadProof = async () => {
    if (!vault || isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    try {
      await generateVaultProofPdf(vault);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(vaultDetailActions.fetchVaultDetailStart({ id }));
    }
  }, [dispatch, id]);

  if (isLoading || !vault) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <Skeleton className="h-8 w-32 mb-8 bg-gray-200" />
          <Skeleton className="h-48 w-full mb-8 bg-gray-200 rounded-xl" />
          <Skeleton className="h-6 w-48 mb-4 bg-gray-200" />
          <Skeleton className="h-16 w-full mb-2 bg-gray-100 rounded-lg" />
          <Skeleton className="h-16 w-full mb-2 bg-gray-100 rounded-lg" />
          <Skeleton className="h-16 w-full bg-gray-100 rounded-lg" />
        </div>
      </div>
    );
  }

  const vaultStatus = vault.status
    ? getStatusConfig("vault", vault.status)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Motorcycle Overview Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <VaultImage
                vault={vault}
                imgClassName="w-full h-full object-cover"
                iconClassName="w-7 h-7 text-blue-600"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {vault.name}
              </h1>
              {vault.description && (
                <p className="text-gray-500 mt-1 text-base">
                  {vault.description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3 mt-3">
                {vaultStatus && (
                  <Badge variant="secondary" className={vaultStatus.className}>
                    {vaultStatus.label}
                  </Badge>
                )}
                {vault.ledger && (
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 text-gray-600 border-gray-200"
                  >
                    {ledgerName(vault.ledger) || vault.ledger}
                  </Badge>
                )}
                {vault.created_at && (
                  <span className="flex items-center gap-1.5 text-sm text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    Registered {formatDate(vault.created_at)}
                  </span>
                )}
                {vault.streams && (
                  <span className="flex items-center gap-1.5 text-sm text-gray-400">
                    <Layers className="w-3.5 h-3.5" />
                    {vault.streams.length} stream
                    {vault.streams.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-5 bg-gray-100" />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Blockchain verification */}
            {vault.tx_hash ? (
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700 font-medium">
                  Verified on blockchain
                </span>
                <CopyableHash value={vault.tx_hash} />
              </div>
            ) : (
              <div />
            )}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadProof}
                disabled={isGeneratingPdf}
                className="border-blue-200 text-blue-600 hover:bg-blue-50 w-fit"
              >
                {isGeneratingPdf ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                )}
                {isGeneratingPdf ? "Generating..." : "Download Proof"}
              </Button>
              {vault.tx_hash && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => viewTXInExplorer(vault.tx_hash!, vault.ledger)}
                  className="border-gray-200 text-gray-600 hover:bg-gray-50 w-fit"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                  Explorer
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Service History */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Service History
          </h2>

          {vault.streams && vault.streams.length > 0 ? (
            <StreamList vaultId={vault.id} streams={vault.streams} />
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
              <Layers className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                No service streams yet
              </h3>
              <p className="text-sm text-gray-500">
                Service records will appear here once the dealership uploads
                repair documentation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VaultDetail;
