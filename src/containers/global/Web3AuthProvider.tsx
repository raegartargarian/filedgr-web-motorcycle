// The Web3Auth session lifecycle (init, rehydration, redirect-return handling,
// user normalisation, logout) lives in @filedgr/web-core/auth. This file keeps
// only the dealership demo's env/chain/login-method configuration and hands it
// to the shared provider via `buildOptions`. Consumers keep importing
// `useWeb3Auth` and `<Web3AuthProvider>` from here.
import { isProduction } from "@/shared/constants/env";
import {
  Web3AuthProvider as CoreWeb3AuthProvider,
  useWeb3Auth,
} from "@filedgr/web-core/auth";
import {
  CHAIN_NAMESPACES,
  WALLET_CONNECTORS,
  WEB3AUTH_NETWORK,
  Web3AuthOptions,
} from "@web3auth/modal";
import React from "react";

export { useWeb3Auth };
export type { Web3AuthContextType } from "@filedgr/web-core/auth";

const clientId = import.meta.env.VITE_AUTH_CLIENT_ID;

const buildOptions = (): Web3AuthOptions => {
  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: isProduction
      ? "0x89" // hex of 137, mainnet
      : "0x13882", // hex of 80002, polygon amoy testnet
    rpcTarget: isProduction
      ? import.meta.env.VITE_POLYGON_MAINNET_RPC
      : import.meta.env.VITE_POLYGON_AMOY_RPC,
    displayName: isProduction ? "Polygon" : "Polygon Amoy Testnet",
    blockExplorerUrl: isProduction
      ? "https://polygonscan.com/"
      : "https://amoy.polygonscan.com/",
    ticker: "POL",
    tickerName: "Polygon Ecosystem Token",
    logo: "https://cryptologos.cc/logos/polygon-matic-logo.png",
  };

  return {
    clientId,
    web3AuthNetwork: isProduction
      ? WEB3AUTH_NETWORK.SAPPHIRE_MAINNET
      : WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    chains: [chainConfig],
    defaultChainId: chainConfig.chainId,
    modalConfig: {
      connectors: {
        [WALLET_CONNECTORS.AUTH]: {
          label: "auth",
          loginMethods: {
            google: { name: "Google", showOnModal: true },
            apple: { name: "Apple", showOnModal: false },
            twitter: { name: "Twitter", showOnModal: false },
            facebook: { name: "Facebook", showOnModal: false },
            discord: { name: "Discord", showOnModal: false },
            farcaster: { name: "Farcaster", showOnModal: false },
            github: { name: "GitHub", showOnModal: false },
            reddit: { name: "Reddit", showOnModal: false },
            line: { name: "Line", showOnModal: false },
            kakao: { name: "Kakao", showOnModal: false },
            linkedin: { name: "LinkedIn", showOnModal: false },
            twitch: { name: "Twitch", showOnModal: false },
            wechat: { name: "WeChat", showOnModal: false },
            email_passwordless: { name: "Email", showOnModal: true },
            sms_passwordless: { name: "SMS", showOnModal: false },
          },
        },
      },
    },
  };
};

export const Web3AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <CoreWeb3AuthProvider buildOptions={buildOptions}>
    {children}
  </CoreWeb3AuthProvider>
);
