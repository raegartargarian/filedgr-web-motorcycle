import { Attachment } from "@/shared/types/attachment";
import { ProcessedRepairData } from "@/shared/utils/zipHandler";

export interface ServiceRecordState {
  attachment: Attachment | null;
  repairData: ProcessedRepairData | null;
  isLoading: boolean;
  isProcessingZip: boolean;
  error: string | null;
}
