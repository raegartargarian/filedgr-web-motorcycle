// Backend status → label + badge classes. Labels and semantic colours come
// from @filedgr/web-core/status so they match the main Filedgr web app; this
// file only maps the semantic colour onto this app's status pill utilities
// (see _utilities.scss).
import {
  AttachmentStatus,
  getAttachmentStatusColor,
  getAttachmentStatusName,
  getStreamStatusColor,
  getStreamStatusName,
  getVaultStatusColor,
  getVaultStatusName,
  StatusColor,
  StreamStatus,
  VaultStatus,
} from "@filedgr/web-core/status";

export type StatusEntity = "vault" | "stream" | "attachment";
export type StatusEntry = { label: string; className: string };

const COLOR_CLASSES: Record<StatusColor, string> = {
  success: "status-success",
  error: "status-error",
  secondary: "status-warning",
};

const RESOLVERS: Record<
  StatusEntity,
  { name: (s: string) => string; color: (s: string) => StatusColor }
> = {
  vault: {
    name: (s) => getVaultStatusName(s as VaultStatus),
    color: (s) => getVaultStatusColor(s as VaultStatus),
  },
  stream: {
    name: (s) => getStreamStatusName(s as StreamStatus),
    color: (s) => getStreamStatusColor(s as StreamStatus),
  },
  attachment: {
    name: (s) => getAttachmentStatusName(s as AttachmentStatus),
    color: (s) => getAttachmentStatusColor(s as AttachmentStatus),
  },
};

export const getStatusConfig = (
  entity: StatusEntity,
  status: string,
): StatusEntry => {
  const { name, color } = RESOLVERS[entity];
  const key = status.trim().toUpperCase();
  return { label: name(key) || key, className: COLOR_CLASSES[color(key)] };
};
