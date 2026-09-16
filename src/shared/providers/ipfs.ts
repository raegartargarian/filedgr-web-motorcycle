import { LocalStorageKeys } from "@/shared/utils/localStorageHelpers";
import {
  getIPFSIMGAddr,
  getIPFSIMGAddrPrivate,
} from "@/shared/utils/getIPFSAddrs";
import axios, { AxiosRequestConfig } from "axios";

/** Who may read an attachment's files, and what the private gateway needs. */
export interface IpfsAccess {
  isPublic: boolean;
  txHash?: string | null;
  ledger?: string | null;
}

export const ipfsFileUrl = (cid: string, isPublic: boolean) =>
  isPublic ? getIPFSIMGAddr(cid) : getIPFSIMGAddrPrivate(cid);

const requestConfig = ({
  isPublic,
  txHash,
  ledger,
}: IpfsAccess): AxiosRequestConfig => {
  const config: AxiosRequestConfig = { responseType: "arraybuffer" };
  if (isPublic) return config;
  const token = localStorage.getItem(LocalStorageKeys.jwtAccessKey);
  if (token) {
    config.headers = {
      Authorization: `Bearer ${token.replace(/"/g, "")}`,
      "X-LedgerInfo": JSON.stringify({ tx_hash: txHash, ledger }),
    };
  }
  return config;
};

/** Download a file's bytes from the matching IPFS gateway. */
export const fetchIpfsFile = async (
  cid: string,
  access: IpfsAccess,
): Promise<ArrayBuffer> => {
  const response = await axios.get<ArrayBuffer>(
    ipfsFileUrl(cid, access.isPublic),
    requestConfig(access),
  );
  return response.data;
};
