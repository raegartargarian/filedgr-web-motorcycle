import { Button } from "@/components/ui/button";
import { BikeLoader } from "@/shared/components/BikeLoader";
import NoActivity from "@/shared/components/EmptyData";
import { VaultCardsSkeleton } from "@/shared/components/PageSkeletons";
import { useInfiniteScroll } from "@filedgr/web-core/react";
import { AlertTriangle, Bike } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GlobalSelectors } from "../global/selectors";
import VaultItem from "./components/VaultItem";
import { vaultsSelectors } from "./selectors";
import { vaultsActions } from "./slice";

const Vaults = () => {
  const dispatch = useDispatch();

  const vaults = useSelector(vaultsSelectors.vaults);
  const isFirstLoading = useSelector(vaultsSelectors.isFirstLoading);
  const isFetching = useSelector(vaultsSelectors.isFetching);
  const currentPage = useSelector(vaultsSelectors.currentPage);
  const hasMore = useSelector(vaultsSelectors.hasMore);
  const error = useSelector(vaultsSelectors.error);
  const authData = useSelector(GlobalSelectors.authData);

  useEffect(() => {
    dispatch(vaultsActions.fetchVaultsStart({ page: 1 }));
  }, [dispatch, authData]);

  const sentinelRef = useInfiniteScroll({
    hasMore,
    isLoading: isFetching,
    onLoadMore: () =>
      dispatch(vaultsActions.fetchVaultsStart({ page: currentPage + 1 })),
  });

  const isEmpty = !isFirstLoading && vaults.length === 0;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="u-eyebrow">Your garage</span>
            <h1 className="u-display mt-2 text-4xl md:text-5xl">
              Your motorcycles
            </h1>
          </div>
          {!isFirstLoading && !isEmpty && (
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Bike className="h-4 w-4 text-primary" />
              {vaults.length} registered
            </span>
          )}
        </div>

        {isFirstLoading ? (
          <VaultCardsSkeleton />
        ) : isEmpty ? (
          <div className="mt-16 flex flex-col items-center justify-center">
            {error ? (
              <>
                <NoActivity
                  icon={AlertTriangle}
                  title="Couldn't Load Motorcycles"
                  description="Something went wrong while loading your motorcycles. Please try again."
                />
                <Button
                  variant="outline"
                  onClick={() =>
                    dispatch(vaultsActions.fetchVaultsStart({ page: 1 }))
                  }
                >
                  Try again
                </Button>
              </>
            ) : (
              <NoActivity
                title="No Motorcycles Found"
                description="No motorcycles have been registered yet. Motorcycles will appear here once the dealership registers them."
              />
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2">
              {vaults.map((vault) => (
                <VaultItem key={vault.id} vault={vault} />
              ))}
            </div>
            {hasMore && (
              <div ref={sentinelRef} aria-hidden className="h-px w-full" />
            )}
            {isFetching && (
              <div className="mt-8 flex w-full items-center justify-center">
                <BikeLoader />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Vaults;
