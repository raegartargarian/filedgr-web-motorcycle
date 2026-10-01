import { getVaults } from "@/shared/providers/api";
import { VaultDto } from "@/shared/types/vault";
import { readListPage } from "@/shared/utils/listPage";
import { call, put, takeLatest } from "redux-saga/effects";
import { vaultsActions } from "./slice";

const TEMPLATE_IDS: string[] = (import.meta.env.VITE_MOTORCYCLE_TEMPLATE_IDS || "")
  .split(",")
  .map((id: string) => id.trim())
  .filter(Boolean);

export function* fetchVaultsSaga(
  action: ReturnType<typeof vaultsActions.fetchVaultsStart>,
): any {
  try {
    const { page } = action.payload;
    const response = yield call(getVaults, TEMPLATE_IDS, page);
    const { content, current_page, total_pages } = readListPage<VaultDto>(
      response,
      page,
    );

    yield put(
      vaultsActions.fetchVaultsSuccess({
        vaults: content,
        currentPage: current_page,
        totalPages: total_pages,
        hasMore: current_page < total_pages,
      }),
    );
  } catch (error: any) {
    yield put(vaultsActions.fetchVaultsFailure(error.message));
  }
}

export function* vaultsSaga() {
  yield takeLatest(vaultsActions.fetchVaultsStart.type, fetchVaultsSaga);
}
