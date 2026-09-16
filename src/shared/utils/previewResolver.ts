import {
  fetchIpfsFile,
  IpfsAccess,
  ipfsFileUrl,
} from "@/shared/providers/ipfs";
import type { SourceResolver } from "@filedgr/web-core/preview";

/**
 * A {@link SourceResolver} over the IPFS gateways. `source.id` is the CID.
 * Public files resolve to a direct gateway URL; private ones are downloaded
 * with the caller's token and served from a blob URL the viewer releases.
 */
export const createIpfsResolver = (access: IpfsAccess): SourceResolver => ({
  async getUrl(source) {
    if (access.isPublic) return { url: ipfsFileUrl(source.id, true) };
    const bytes = await fetchIpfsFile(source.id, access);
    const url = URL.createObjectURL(
      new Blob([bytes], { type: source.mimeType }),
    );
    return { url, release: () => URL.revokeObjectURL(url) };
  },
  getArrayBuffer(source) {
    return fetchIpfsFile(source.id, access);
  },
});

/** For files already extracted client-side: `source.id` is the blob URL. */
export const blobUrlResolver: SourceResolver = {
  async getUrl(source) {
    return { url: source.id };
  },
  async getArrayBuffer(source) {
    return (await fetch(source.id)).arrayBuffer();
  },
};
