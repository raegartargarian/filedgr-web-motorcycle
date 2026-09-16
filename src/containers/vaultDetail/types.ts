import { VaultDto } from "@/shared/types/vault";

export interface VaultDetailState {
  vault: VaultDto | null;
  isLoading: boolean;
  error: string | null;
}

export type { Attachment } from "@/shared/types/attachment";
