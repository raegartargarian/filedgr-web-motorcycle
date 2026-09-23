import { VaultDto } from "@/shared/types/vault";
import { getIPFSIMGAddr } from "@/shared/utils/getIPFSAddrs";
import { useVaultImage } from "@filedgr/web-core/vault";
import { Bike } from "lucide-react";
import React from "react";

interface VaultImageProps {
  vault: Pick<VaultDto, "image_cid" | "default_image_cid" | "name">;
  /** Classes for the <img> when an image is available. */
  imgClassName?: string;
  /** Classes for the fallback Bike icon (no image / load error). */
  iconClassName?: string;
}

/**
 * Renders a vault's image (resolved from image_cid, falling back to
 * default_image_cid via IPFS), with a graceful Bike-icon fallback when there's
 * no CID or the image fails to load. Used by the vault list card and the vault
 * detail header.
 */
export const VaultImage: React.FC<VaultImageProps> = ({
  vault,
  imgClassName = "",
  iconClassName = "",
}) => {
  const { url, showImage, onError } = useVaultImage(vault, getIPFSIMGAddr);

  if (showImage) {
    return (
      <img
        src={url!}
        alt={vault.name}
        onError={onError}
        className={imgClassName}
      />
    );
  }

  return <Bike className={iconClassName} />;
};

export default VaultImage;
