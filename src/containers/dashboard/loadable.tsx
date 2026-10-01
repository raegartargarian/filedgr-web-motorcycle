import { DashboardSkeleton } from "@/shared/components/PageSkeletons";
import { lazyLoad } from "@filedgr/web-core/react";

export const DashboardPage = lazyLoad(
  () => import("./index"),
  (module) => module.default,
  { fallback: <DashboardSkeleton /> },
);
