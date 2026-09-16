import { extractZipFiles } from "@filedgr/web-core/zip";

export interface RepairSessionData {
  vehicleInfo: {
    make?: string;
    model?: string;
    year?: string;
    vin?: string;
    mileage?: string;
    licensePlate?: string;
  };
  repairInfo: {
    date?: string;
    type?: string;
    description?: string;
    laborHours?: number;
    cost?: number;
    warranty?: string;
    technician?: string;
  };
  partsUsed?: Array<{
    partName?: string;
    partNumber?: string;
    quantity?: number;
    cost?: number;
    warranty?: string;
  }>;
  timestamps?: {
    started?: string;
    completed?: string;
    inspected?: string;
  };
}

export interface RepairImage {
  type: "before" | "after";
  category: string; // e.g., "oil", "tires", "brakes"
  sequence: number; // for multiple images of same category
  filename: string;
  url?: string;
}

export interface RepairDocument {
  name: string;
  type: string; // extracted from filename (e.g., "receipt", "agreement")
  filename: string;
  content?: ArrayBuffer;
  url?: string;
}

export interface ProcessedRepairData {
  type: "repair-session";
  repairData: RepairSessionData[];
  images: RepairImage[];
  documents: RepairDocument[];
  imageMatches: Array<{
    category: string;
    sequence: number;
    before?: RepairImage;
    after?: RepairImage;
  }>;
}

function parseRepairJSON(content: string): RepairSessionData[] {
  try {
    const json = JSON.parse(content);

    // Handle both single object and array of objects
    const sessions = Array.isArray(json) ? json : [json];

    return sessions.map((session: any) => ({
      vehicleInfo: {
        make:
          session.vehicleInfo?.make || session.vehicle?.make || session.make,
        model:
          session.vehicleInfo?.model || session.vehicle?.model || session.model,
        year:
          session.vehicleInfo?.year || session.vehicle?.year || session.year,
        vin: session.vehicleInfo?.vin || session.vehicle?.vin || session.vin,
        mileage:
          session.vehicleInfo?.mileage ||
          session.vehicle?.mileage ||
          session.mileage,
        licensePlate:
          session.vehicleInfo?.licensePlate ||
          session.vehicle?.licensePlate ||
          session.license_plate,
      },
      repairInfo: {
        date: session.repairInfo?.date || session.repair?.date || session.date,
        type:
          session.repairInfo?.type ||
          session.repair?.type ||
          session.type ||
          session.service_type,
        description:
          session.repairInfo?.description ||
          session.repair?.description ||
          session.description,
        laborHours:
          session.repairInfo?.laborHours ||
          session.repair?.laborHours ||
          session.labor_hours ||
          session.hours,
        cost:
          session.repairInfo?.cost ||
          session.repair?.cost ||
          session.cost ||
          session.total_cost,
        warranty:
          session.repairInfo?.warranty ||
          session.repair?.warranty ||
          session.warranty,
        technician:
          session.repairInfo?.technician ||
          session.repair?.technician ||
          session.technician ||
          session.mechanic,
      },
      partsUsed: session.partsUsed || session.parts || session.parts_used || [],
      timestamps: {
        started: session.timestamps?.started || session.start_time,
        completed: session.timestamps?.completed || session.completion_time,
        inspected: session.timestamps?.inspected || session.inspection_time,
      },
    }));
  } catch (e) {
    console.error("Failed to parse repair JSON:", e);
    return [];
  }
}

function categorizeImage(filename: string): RepairImage | null {
  const lowerFilename = filename.toLowerCase();

  // Try pattern with sequence number first: old_category_name_123.ext or new_category_name_123.ext
  let match = lowerFilename.match(/^(old|new)_(.+?)_(\d+)\.([a-z]+)$/);

  if (match) {
    const [, prefix, categoryPart, sequenceStr] = match;
    const type = prefix === "old" ? "before" : "after";
    const sequence = parseInt(sequenceStr);

    // Format category: replace underscores with spaces and capitalize words
    const formattedCategory = categoryPart
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return {
      type,
      category: formattedCategory,
      sequence,
      filename,
    };
  }

  // Try pattern without sequence number: old_category_name.ext or new_category_name.ext
  match = lowerFilename.match(/^(old|new)_(.+)\.([a-z]+)$/);

  if (match) {
    const [, prefix, categoryPart] = match;
    const type = prefix === "old" ? "before" : "after";

    // Format category: replace underscores with spaces and capitalize words
    const formattedCategory = categoryPart
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return {
      type,
      category: formattedCategory,
      sequence: 1, // default sequence
      filename,
    };
  }

  return null;
}

function categorizeDocument(filename: string): RepairDocument {
  const name = filename.toLowerCase();
  let type = "document";

  // Extract document type from filename
  if (name.includes("receipt")) type = "receipt";
  else if (name.includes("agreement") || name.includes("contract"))
    type = "agreement";
  else if (name.includes("warranty")) type = "warranty";
  else if (name.includes("invoice")) type = "invoice";
  else if (name.includes("estimate")) type = "estimate";
  else if (name.includes("inspection")) type = "inspection";
  else {
    // Try to extract from filename without extension
    const nameWithoutExt = filename.split(".")[0].toLowerCase();
    type = nameWithoutExt.replace(/[_-]/g, " ");
  }

  return {
    name: type.charAt(0).toUpperCase() + type.slice(1),
    type,
    filename,
  };
}

function matchBeforeAfterImages(images: RepairImage[]): Array<{
  category: string;
  sequence: number;
  before?: RepairImage;
  after?: RepairImage;
}> {
  const matches: {
    [key: string]: { before?: RepairImage; after?: RepairImage };
  } = {};

  // Group images by category and sequence
  images.forEach((image) => {
    const key = `${image.category}_${image.sequence}`;
    if (!matches[key]) {
      matches[key] = {};
    }
    matches[key][image.type] = image;
  });

  // Convert to array format
  return Object.entries(matches).map(([key, match]) => {
    const [category, sequence] = key.split("_");
    return {
      category,
      sequence: parseInt(sequence),
      before: match.before,
      after: match.after,
    };
  });
}

/** A zip bundle is just the individual-files path after extraction. */
export async function processRepairZipFile(
  zipData: ArrayBuffer,
): Promise<ProcessedRepairData> {
  const entries = await extractZipFiles(new Blob([zipData]));
  const files = await Promise.all(
    [...entries].map(async ([filename, blob]) => ({
      filename,
      data: await blob.arrayBuffer(),
    })),
  );
  return processIndividualRepairFiles(files);
}

export interface IndividualFileInput {
  filename: string;
  data: ArrayBuffer;
}

export async function processIndividualRepairFiles(
  files: IndividualFileInput[],
): Promise<ProcessedRepairData> {
  let repairData: RepairSessionData[] = [];
  const images: RepairImage[] = [];
  const documents: RepairDocument[] = [];

  for (const file of files) {
    const fileName = file.filename.toLowerCase();

    try {
      if (fileName.endsWith(".json")) {
        const content = new TextDecoder().decode(file.data);
        const parsed = parseRepairJSON(content);
        repairData = repairData.concat(parsed);
      } else if (fileName.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        const image = categorizeImage(file.filename);
        if (image) {
          const blob = new Blob([file.data]);
          image.url = URL.createObjectURL(blob);
          images.push(image);
        }
      } else if (fileName.endsWith(".pdf")) {
        const document = categorizeDocument(file.filename);
        document.content = file.data;
        const blob = new Blob([file.data], { type: "application/pdf" });
        document.url = URL.createObjectURL(blob);
        documents.push(document);
      }
    } catch (error) {
      console.error(`Failed to process file ${file.filename}:`, error);
    }
  }

  const imageMatches = matchBeforeAfterImages(images);

  return {
    type: "repair-session",
    repairData,
    images,
    documents,
    imageMatches,
  };
}

// Helper function to clean up blob URLs when component unmounts
export function cleanupRepairData(data: ProcessedRepairData) {
  // Clean up image URLs
  data.images.forEach((image) => {
    if (image.url) {
      URL.revokeObjectURL(image.url);
    }
  });

  // Clean up document URLs
  data.documents.forEach((document) => {
    if (document.url) {
      URL.revokeObjectURL(document.url);
    }
  });
}
