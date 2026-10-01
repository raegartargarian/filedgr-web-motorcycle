import { Skeleton } from "@/components/ui/skeleton";

// Loading placeholders shaped like the pages they stand in for. Each page uses
// its skeleton both as the lazy-route fallback (while the page's code loads)
// and while its data loads, so navigation goes straight to one skeleton.

/** A column of record-row placeholders. */
export const RecordRowsSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <Skeleton key={i} className="h-16 w-full rounded-lg" />
    ))}
  </div>
);

export const VaultDetailSkeleton = () => (
  <div className="min-h-screen">
    <Skeleton className="h-[52svh] min-h-[440px] w-full rounded-none" />
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[74px] rounded-xl" />
        ))}
      </div>
      <RecordRowsSkeleton count={3} />
    </div>
  </div>
);

/** The compact vault cover used by pages one level below the vault. */
export const CompactCoverSkeleton = () => (
  <Skeleton className="h-[36svh] min-h-[300px] w-full rounded-none" />
);

export const StreamDetailSkeleton = () => (
  <div className="min-h-screen">
    <CompactCoverSkeleton />
    <div className="container mx-auto max-w-5xl px-4 py-8 md:py-10">
      <RecordRowsSkeleton />
    </div>
  </div>
);

/** The home page is static; this holds the hero's space while it loads. */
export const DashboardSkeleton = () => (
  <Skeleton className="h-[calc(100svh-64px)] min-h-[640px] w-full rounded-none" />
);

/** The motorcycle cards of the vault list. */
export const VaultCardsSkeleton = () => (
  <div className="grid gap-6 md:grid-cols-2">
    {Array.from({ length: 2 }).map((_, i) => (
      <Skeleton
        key={i}
        className="h-[44svh] min-h-[340px] w-full rounded-2xl"
      />
    ))}
  </div>
);

export const VaultsSkeleton = () => (
  <div className="min-h-screen">
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-10 w-72 md:h-12" />
      </div>
      <VaultCardsSkeleton />
    </div>
  </div>
);

export const ServiceRecordSkeleton = () => (
  <div className="min-h-screen">
    <div className="max-w-6xl mx-auto py-8 px-4">
      <Skeleton className="h-8 w-48 mb-8 bg-steel-700" />
      <Skeleton className="h-32 w-full mb-6 bg-steel-700 rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 bg-steel-700 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-96 w-full bg-steel-700 rounded-xl" />
    </div>
  </div>
);
