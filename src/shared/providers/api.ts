import { globalActions } from "@/containers/global/slice";
import { store } from "@/store";
import { LocalStorageKeys } from "@/shared/utils/localStorageHelpers";
import { createApiClient, createFiledgrApi } from "@filedgr/web-core/api";

export type { PaginatedResponse } from "@filedgr/web-core/api";

export const PAGE_SIZE = 15;

const logOut = () => store.dispatch(globalActions.logOut());

export const apiClient = createApiClient({
  baseURL: import.meta.env.VITE_API_URL,
  getToken: () => localStorage.getItem(LocalStorageKeys.jwtAccessKey),
  onTokenExpired: logOut,
});

// web-core only handles the client-side "token already expired" case; a
// rejected or revoked token still comes back from the server as 401/403.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) logOut();
    return Promise.reject(error);
  },
);

const api = createFiledgrApi(apiClient, { defaultPageSize: PAGE_SIZE });

export const { getSingleVault, getSingleAttachment } = api;

/** Vaults created from the dealership templates, newest first. */
export const getVaults = (templateIds: string[], page: number = 1) =>
  api.getVaults(page, "", "created_at", "DESC", false, undefined, templateIds);

/**
 * `archived` follows the backend's reading: left out, the page holds live
 * records only; `true` includes the archived ones alongside them. There is no
 * archived-only mode. An empty page comes back as 204 with no body — see
 * `readListPage`.
 */
export const getStreamAttachments = (
  streamCode: string,
  page: number = 1,
  pageSize: number = PAGE_SIZE,
  archived?: boolean,
) => api.getTokenAttachments(streamCode, page, pageSize, archived);
