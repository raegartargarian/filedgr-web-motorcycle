import { runSaga } from "redux-saga";
import { describe, expect, it, vi } from "vitest";
import { getVaults } from "@/shared/providers/api";
import { fetchVaultsSaga } from "./saga";
import { vaultsActions } from "./slice";

vi.mock("@/shared/providers/api", () => ({ getVaults: vi.fn() }));

const run = async (response: unknown) => {
  vi.mocked(getVaults).mockResolvedValue(response as never);
  const dispatched: unknown[] = [];
  await runSaga(
    { dispatch: (action) => dispatched.push(action) },
    fetchVaultsSaga,
    vaultsActions.fetchVaultsStart({ page: 1 }),
  ).toPromise();
  return dispatched;
};

describe("fetchVaultsSaga", () => {
  it("reads a 204 with no body as an empty list, not a failure", async () => {
    expect(await run({ status: 204, data: "" })).toEqual([
      vaultsActions.fetchVaultsSuccess({
        vaults: [],
        currentPage: 1,
        totalPages: 1,
        hasMore: false,
      }),
    ]);
  });

  it("passes a page of vaults through", async () => {
    const vault = { id: "v1" };
    expect(
      await run({
        status: 200,
        data: {
          content: [vault],
          total_records: 2,
          current_page: 1,
          total_pages: 2,
        },
      }),
    ).toEqual([
      vaultsActions.fetchVaultsSuccess({
        vaults: [vault] as never,
        currentPage: 1,
        totalPages: 2,
        hasMore: true,
      }),
    ]);
  });
});
