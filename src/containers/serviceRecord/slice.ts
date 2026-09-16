import { ProcessedRepairData } from "@/shared/utils/zipHandler";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Attachment } from "@/shared/types/attachment";
import { ServiceRecordState } from "./types";

const initialState: ServiceRecordState = {
  attachment: null,
  repairData: null,
  isLoading: false,
  isProcessingZip: false,
  error: null,
};

const serviceRecordSlice = createSlice({
  name: "serviceRecord",
  initialState,
  reducers: {
    fetchStart(state, _action: PayloadAction<{ id: string }>) {
      state.isLoading = true;
      state.error = null;
      state.attachment = null;
      state.repairData = null;
      state.isProcessingZip = false;
    },
    fetchSuccess(state, action: PayloadAction<Attachment>) {
      state.isLoading = false;
      state.attachment = action.payload;
    },
    setProcessingZip(state, action: PayloadAction<boolean>) {
      state.isProcessingZip = action.payload;
    },
    setRepairData(state, action: PayloadAction<ProcessedRepairData>) {
      state.isProcessingZip = false;
      state.repairData = action.payload;
    },
    fetchFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.isProcessingZip = false;
      state.error = action.payload;
    },
    reset(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { actions: serviceRecordActions, reducer: serviceRecordReducer } =
  serviceRecordSlice;
