import type { PaginatedResponse } from "@filedgr/web-core/api";

/** The parts of a list response that matter here. */
export interface ListResponse<T> {
  status: number;
  data?: Partial<PaginatedResponse<T>> | "" | null;
}

/**
 * The backend answers an empty list page with HTTP 204 and no body rather
 * than 200 with an empty list, so `response.data` is `""` and reading
 * `.content` off it gives nothing. Normalise that into the envelope callers
 * expect: an empty page whose page count is the page that was asked for, so
 * page 1 reads as "nothing here" and a later page as "nothing further",
 * leaving what is already loaded alone.
 */
export const readListPage = <T>(
  response: ListResponse<T>,
  requestedPage: number,
): PaginatedResponse<T> => {
  const data = response.status === 204 ? null : response.data;
  if (!data) {
    return {
      content: [],
      total_records: 0,
      current_page: requestedPage,
      total_pages: requestedPage,
    };
  }
  return {
    content: data.content ?? [],
    total_records: data.total_records ?? 0,
    current_page: data.current_page ?? requestedPage,
    total_pages: data.total_pages ?? requestedPage,
  };
};
