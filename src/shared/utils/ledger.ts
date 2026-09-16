import { isProduction } from "@/shared/constants/env";
import { LedgerId, ledgerDisplayName } from "@filedgr/web-core/ledger";

export type { LedgerId };

/** User-facing network name; falls back to the raw enum for unknown ledgers. */
export const ledgerName = (ledger: string | null | undefined): string =>
  ledger ? ledgerDisplayName(ledger as LedgerId, isProduction) : "";
