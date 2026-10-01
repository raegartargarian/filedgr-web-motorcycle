import { VaultsSkeleton } from "@/shared/components/PageSkeletons";
import { lazyLoad } from "@filedgr/web-core/react";

export const VaultsPage = lazyLoad(
  () => import("./index"),
  (module) => module.default,
  { fallback: <VaultsSkeleton /> },
);
