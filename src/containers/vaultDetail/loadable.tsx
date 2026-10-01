import { VaultDetailSkeleton } from "@/shared/components/PageSkeletons";
import { lazyLoad } from "@filedgr/web-core/react";

export const VaultDetailPage = lazyLoad(
  () => import("./index"),
  (module) => module.default,
  { fallback: <VaultDetailSkeleton /> },
);
