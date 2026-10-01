import { ServiceRecordSkeleton } from "@/shared/components/PageSkeletons";
import { lazyLoad } from "@filedgr/web-core/react";

export const ServiceRecordPage = lazyLoad(
  () => import("./index"),
  (module) => module.default,
  { fallback: <ServiceRecordSkeleton /> },
);
