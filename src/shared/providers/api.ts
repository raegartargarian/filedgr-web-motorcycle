import { globalActions } from "@/containers/global/slice";
import {
  fixtureVault,
  getFixtureRecord,
  getFixtureStreamRecords,
  getFixtureVault,
  isFixtureId,
} from "@/shared/fixtures";
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

/** A 200 response carrying bundled fixture data, shaped like axios'. */
const fixtureResponse = <T>(data: T) => ({ status: 200, data });

const fixturePage = <T>(content: T[]) =>
  fixtureResponse({
    content,
    total_records: content.length,
    current_page: 1,
    total_pages: 1,
  });

/**
 * Vaults created from the dealership templates, newest first. Falls back to
 * the bundled demo vault when the request fails or there are no vaults yet.
 */
export const getVaults = async (templateIds: string[], page: number = 1) => {
  try {
    const response = await api.getVaults(
      page,
      "",
      "created_at",
      "DESC",
      false,
      undefined,
      templateIds,
    );
    if (page > 1 || response.data?.content?.length) return response;
    console.warn("No vaults found, showing the demo vault");
  } catch (error) {
    if (page > 1) throw error;
    console.warn("Vaults unavailable, showing the demo vault:", error);
  }
  return fixturePage([fixtureVault]);
};

export const getSingleVault = async (id: string) => {
  const fixture = getFixtureVault(id);
  return fixture ? fixtureResponse(fixture) : api.getSingleVault(id);
};

export const getSingleAttachment = async (id: string) => {
  const fixture = getFixtureRecord(id);
  return fixture ? fixtureResponse(fixture) : api.getSingleAttachment(id);
};

/**
 * `archived` follows the backend's reading: left out, the page holds live
 * records only; `true` includes the archived ones alongside them. There is no
 * archived-only mode. An empty page comes back as 204 with no body — see
 * `readListPage`. The demo vault's streams are served from the fixtures.
 */
export const getStreamAttachments = async (
  streamCode: string,
  page: number = 1,
  pageSize: number = PAGE_SIZE,
  archived?: boolean,
) => {
  if (isFixtureId(streamCode)) {
    const records =
      page === 1 ? (getFixtureStreamRecords(streamCode) ?? []) : [];
    return fixturePage(records.slice(0, pageSize));
  }
  return api.getTokenAttachments(streamCode, page, pageSize, archived);
};
