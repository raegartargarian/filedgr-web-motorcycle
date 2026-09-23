import { readListPage, type ListResponse } from "@/shared/utils/listPage";

/**
 * How many of a stream's records are archived.
 *
 * The list endpoint has no archived-only mode — `archived=true` means "include
 * the archived ones" — so the number is the difference between two totals:
 * everything, and live only. Each comes from a one-item page, since only its
 * `total_records` is read.
 */

/**
 * The total off a list page. A bodiless 204 counts as zero (see
 * `readListPage`); anything other than a page is an unknown, not a zero.
 */
export const totalRecordsOf = (page: ListResponse<unknown>): number | null =>
  page.status === 200 || page.status === 204
    ? readListPage(page, 1).total_records
    : null;

/**
 * Archived = everything − live. Null when either page could not be read, so a
 * caller keeps the count it had rather than replacing it with a guess.
 */
export const archivedCountOf = (
  everything: ListResponse<unknown>,
  liveOnly: ListResponse<unknown>,
): number | null => {
  const total = totalRecordsOf(everything);
  const live = totalRecordsOf(liveOnly);
  if (total === null || live === null) return null;
  return Math.max(0, total - live);
};
