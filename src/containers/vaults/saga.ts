import { getVaults } from "@/shared/providers/api";
import { VaultDto } from "@/shared/types/vault";
import { call, put, takeLatest } from "redux-saga/effects";
import { vaultsActions } from "./slice";

const TEMPLATE_IDS: string[] = (import.meta.env.VITE_MOTORCYCLE_TEMPLATE_IDS || "")
  .split(",")
  .map((id: string) => id.trim())
  .filter(Boolean);

function* fetchVaultsSaga(
  action: ReturnType<typeof vaultsActions.fetchVaultsStart>,
): any {
  try {
    const { page } = action.payload;
    const response = yield call(getVaults, TEMPLATE_IDS, page);
    const data = response.data;

    const vaults: VaultDto[] = data.content;
    const crPage = data.current_page;
    const tPages = data.total_pages;
    const hasMore = crPage < tPages;

    yield put(
      vaultsActions.fetchVaultsSuccess({
        vaults,
        currentPage: crPage,
        totalPages: tPages,
        hasMore,
      }),
    );
  } catch (error: any) {
    yield put(vaultsActions.fetchVaultsFailure(error.message));
  }
}

export function* vaultsSaga() {
  yield takeLatest(vaultsActions.fetchVaultsStart.type, fetchVaultsSaga);
}
