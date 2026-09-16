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

/** A service record: web-core's attachment plus the fields this API embeds. */
export type Attachment = AttachmentModel & {
  file_count?: number;
  stream?: AttachmentStreamModel;
};
