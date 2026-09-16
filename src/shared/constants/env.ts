// The one place the app reads its stage. @filedgr/web-core is env-agnostic, so
// helpers that need to know (ledger labels, Web3Auth network) take this in.
export const isProduction = import.meta.env.VITE_ENV === "production";
