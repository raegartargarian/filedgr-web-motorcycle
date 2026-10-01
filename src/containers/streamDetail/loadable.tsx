import { StreamDetailSkeleton } from "@/shared/components/PageSkeletons";
import { lazyLoad } from "@filedgr/web-core/react";

export const StreamDetailPage = lazyLoad(
  () => import("./index"),
  (module) => module.default,
  { fallback: <StreamDetailSkeleton /> },
);
