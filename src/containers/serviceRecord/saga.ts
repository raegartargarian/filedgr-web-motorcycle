import { getSingleAttachment } from "@/shared/providers/api";
import { fetchIpfsFile, IpfsAccess } from "@/shared/providers/ipfs";
import { Attachment } from "@/shared/types/attachment";
import {
  IndividualFileInput,
  processIndividualRepairFiles,
  processRepairZipFile,
} from "@/shared/utils/zipHandler";
import { call, put, takeLatest } from "redux-saga/effects";
import { serviceRecordActions } from "./slice";

function* fetchServiceRecordSaga(
  action: ReturnType<typeof serviceRecordActions.fetchStart>,
): any {
  try {
    const { id } = action.payload;

    // 1. Fetch attachment detail
    const response = yield call(getSingleAttachment, id);
    const attachment: Attachment = response.data;
    yield put(serviceRecordActions.fetchSuccess(attachment));

    // 2. Separate zip files from individual files
    const allFiles = attachment.files;
    const zipFiles = allFiles?.filter(
      (file) => file.filename?.match(/\.(zip)$/i) != null,
    );

    const access: IpfsAccess = {
      isPublic: attachment.public_vault !== false,
      txHash: attachment.tx_hash,
      ledger: attachment.ledger,
    };

    if (zipFiles && zipFiles.length > 0) {
      // Old path: files were uploaded as a zip bundle
      yield put(serviceRecordActions.setProcessingZip(true));

      const zipData = yield call(fetchIpfsFile, zipFiles[0].cid ?? "", access);
      const processedContent = yield call(processRepairZipFile, zipData);

      if (processedContent.type === "repair-session") {
        yield put(serviceRecordActions.setRepairData(processedContent));
      }
    } else if (allFiles && allFiles.length > 0) {
      // Individual files uploaded without a zip. Only run them through the
      // repair-session pipeline when they actually look like repair content
      // (a repair JSON, or before/after "old_"/"new_" images). Plain document
      // streams (e.g. insurance, warranty, customer info) are left to
      // FileViewer, which shows each PDF/image inline.
      const looksLikeRepair = allFiles.some((file) => {
        const name = file.filename?.toLowerCase() ?? "";
        return name.endsWith(".json") || /^(old|new)_/.test(name);
      });

      if (!looksLikeRepair) {
        // repairData stays null and isProcessingZip stays false, so the
        // ServiceRecord page falls through to <FileViewer />.
        return;
      }

      yield put(serviceRecordActions.setProcessingZip(true));

      const downloadedFiles: IndividualFileInput[] = [];

      for (const file of allFiles) {
        if (!file.cid || !file.filename) continue;
        const data = yield call(fetchIpfsFile, file.cid, access);
        downloadedFiles.push({ filename: file.filename, data });
      }

      const processedContent = yield call(
        processIndividualRepairFiles,
        downloadedFiles,
      );

      if (processedContent.type === "repair-session") {
        yield put(serviceRecordActions.setRepairData(processedContent));
      }
    }
  } catch (error: any) {
    yield put(serviceRecordActions.fetchFailure(error.message));
  }
}

export function* serviceRecordSaga() {
  yield takeLatest(
    serviceRecordActions.fetchStart.type,
    fetchServiceRecordSaga,
  );
}
