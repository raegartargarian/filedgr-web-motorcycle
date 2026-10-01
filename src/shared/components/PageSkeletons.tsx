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
