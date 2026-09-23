import type { FailureInfo } from "@filedgr/web-core/status";
import type {
  AttachmentFileModel,
  AttachmentModel,
} from "@filedgr/web-core/upload";

export type { AttachmentFileModel };

export interface AttachmentStreamModel {
  id?: string;
  asset_code?: string;
  description?: string;
  ledger?: string;
  tx_hash?: string | null;
  status?: string;
}

/**
 * A service record: web-core's attachment plus the fields this API embeds,
 * including the retry/failure block read by @filedgr/web-core/status.
 */
export type Attachment = AttachmentModel &
  FailureInfo & {
    file_count?: number;
    stream?: AttachmentStreamModel;
  };
