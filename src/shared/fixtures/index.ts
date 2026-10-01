// Demo vault bundled with the app. The API provider falls back to it when the
// Filedgr API can't be reached (or no motorcycle vault exists yet), so the
// vault, stream and service-record pages always have something to show.
//
// Fixture files carry a `fixture:<filename>` cid; getIPFSAddrs resolves those
// to the bundled asset, so previews and downloads work without IPFS.
import type {
  Attachment,
  AttachmentFileModel,
} from "@/shared/types/attachment";
import type { VaultDto, VaultStreamDto } from "@/shared/types/vault";
import heroPoster from "@/assets/videos/hero-poster.jpg?no-inline";
import archiveZip from "./Archive.zip?url&no-inline";
import inspectionPdf from "./Inspection.pdf?no-inline";
import invoicePdf from "./Invoice.pdf?no-inline";
import newBrakePads1 from "./new_brake_pads_1.jpg?no-inline";
import newChain1 from "./new_chain_1.jpg?no-inline";
import newChain2 from "./new_chain_2.jpg?no-inline";
import newOil1 from "./new_oil_1.jpg?no-inline";
import oldBrakePads1 from "./old_brake_pads_1.jpg?no-inline";
import oldChain1 from "./old_chain_1.jpg?no-inline";
import oldChain2 from "./old_chain_2.jpg?no-inline";
import oldOil1 from "./old_oil_1.jpg?no-inline";
import receiptPdf from "./Receipt.pdf?no-inline";
import repairSessionJson from "./repair_session.json?url&no-inline";

const FIXTURE_PREFIX = "fixture:";

interface FixtureFile {
  url: string;
  mimetype: string;
  size: number;
}

const fixtureFiles: Record<string, FixtureFile> = {
  "hero-poster.jpg": { url: heroPoster, mimetype: "image/jpeg", size: 55722 },
  "Archive.zip": { url: archiveZip, mimetype: "application/zip", size: 986136 },
  "Inspection.pdf": {
    url: inspectionPdf,
    mimetype: "application/pdf",
    size: 130347,
  },
  "Invoice.pdf": { url: invoicePdf, mimetype: "application/pdf", size: 130559 },
  "Receipt.pdf": { url: receiptPdf, mimetype: "application/pdf", size: 89902 },
  "new_brake_pads_1.jpg": {
    url: newBrakePads1,
    mimetype: "image/jpeg",
    size: 118115,
  },
  "new_chain_1.jpg": { url: newChain1, mimetype: "image/jpeg", size: 136603 },
  "new_chain_2.jpg": { url: newChain2, mimetype: "image/jpeg", size: 125287 },
  "new_oil_1.jpg": { url: newOil1, mimetype: "image/jpeg", size: 101422 },
  "old_brake_pads_1.jpg": {
    url: oldBrakePads1,
    mimetype: "image/jpeg",
    size: 118585,
  },
  "old_chain_1.jpg": { url: oldChain1, mimetype: "image/jpeg", size: 137998 },
  "old_chain_2.jpg": { url: oldChain2, mimetype: "image/jpeg", size: 126758 },
  "old_oil_1.jpg": { url: oldOil1, mimetype: "image/jpeg", size: 98177 },
  "repair_session.json": {
    url: repairSessionJson,
    mimetype: "application/json",
    size: 1931,
  },
};

export const isFixtureId = (id: string | null | undefined) =>
  !!id && id.startsWith(FIXTURE_PREFIX);

/** URL of a bundled fixture file, or undefined for a real IPFS CID. */
export const getFixtureFileUrl = (cid: string): string | undefined =>
  isFixtureId(cid)
    ? fixtureFiles[cid.slice(FIXTURE_PREFIX.length)]?.url
    : undefined;

const LEDGER = "POLYGON_ZKEVM";
const VAULT_ID = `${FIXTURE_PREFIX}vault-ninja-h2`;

const serviceStream: VaultStreamDto = {
  id: `${FIXTURE_PREFIX}stream-service`,
  asset_code: `${FIXTURE_PREFIX}service`,
  description: "The stream mapped to the service-history field",
  status: "FILEDGR_STREAM_COMPLETED",
  tx_hash: null,
  ledger: LEDGER,
  created_at: "2026-01-10T09:00:00Z",
  mapping: "service-history",
};

const documentsStream: VaultStreamDto = {
  id: `${FIXTURE_PREFIX}stream-documents`,
  asset_code: `${FIXTURE_PREFIX}documents`,
  description: "The stream mapped to the documents field",
  status: "FILEDGR_STREAM_COMPLETED",
  tx_hash: null,
  ledger: LEDGER,
  created_at: "2026-01-10T09:00:00Z",
  mapping: "documents",
};

export const fixtureVault: VaultDto = {
  id: VAULT_ID,
  name: "Kawasaki Ninja H2 (2024)",
  description:
    "Demo vault: service history and ownership documents for a 2024 Kawasaki Ninja H2.",
  created_at: "2026-01-10T09:00:00Z",
  status: "FILEDGR_VAULT_COMPLETED",
  ledger: LEDGER,
  tx_hash: null,
  image_cid: `${FIXTURE_PREFIX}hero-poster.jpg`,
  streams: [serviceStream, documentsStream],
  archived: false,
};

const file = (
  recordId: string,
  filename: string,
  createdAt: string,
): AttachmentFileModel => {
  const { mimetype, size } = fixtureFiles[filename];
  return {
    id: `${recordId}-${filename}`,
    filename,
    mimetype,
    size,
    created_at: createdAt,
    status: "FILEDGR_UPLOADED",
    cid: `${FIXTURE_PREFIX}${filename}`,
  };
};

const record = (
  slug: string,
  stream: VaultStreamDto,
  name: string,
  description: string,
  createdAt: string,
  filenames: string[],
): Attachment => {
  const id = `${FIXTURE_PREFIX}${slug}`;
  const files = filenames.map((filename) => file(id, filename, createdAt));
  return {
    id,
    name,
    description,
    created_at: createdAt,
    ledger: LEDGER,
    status: "FILEDGR_DATA_ATTACHMENT_COMPLETED",
    public_vault: true,
    stream_id: stream.id,
    tx_hash: null,
    size: files.reduce((total, f) => total + f.size, 0),
    file_count: files.length,
    files,
    archived: false,
    stream: {
      id: stream.id,
      asset_code: stream.asset_code,
      description: stream.description,
      ledger: LEDGER,
      tx_hash: null,
      status: stream.status,
    },
  };
};

const REPAIR_FILES = [
  "repair_session.json",
  "old_chain_1.jpg",
  "old_chain_2.jpg",
  "new_chain_1.jpg",
  "new_chain_2.jpg",
  "old_brake_pads_1.jpg",
  "new_brake_pads_1.jpg",
  "old_oil_1.jpg",
  "new_oil_1.jpg",
  "Invoice.pdf",
  "Receipt.pdf",
];

const fixtureRecords: Record<string, Attachment[]> = {
  [serviceStream.asset_code!]: [
    record(
      "record-chain-brakes-oil",
      serviceStream,
      "Chain, Sprockets, Brake Pads & Oil",
      "Chain and sprocket replacement, new front brake pads and a full synthetic oil change.",
      "2026-09-12T15:30:00Z",
      REPAIR_FILES,
    ),
    record(
      "record-archived-service",
      serviceStream,
      "Service Bundle (Archive)",
      "The same service session uploaded as a single zip bundle.",
      "2026-09-12T15:00:00Z",
      ["Archive.zip"],
    ),
  ],
  [documentsStream.asset_code!]: [
    record(
      "record-inspection",
      documentsStream,
      "Annual Inspection",
      "Roadworthiness inspection report.",
      "2026-08-28T10:00:00Z",
      ["Inspection.pdf"],
    ),
    record(
      "record-purchase-documents",
      documentsStream,
      "Invoice & Receipt",
      "Purchase invoice and payment receipt.",
      "2026-01-10T09:00:00Z",
      ["Invoice.pdf", "Receipt.pdf"],
    ),
  ],
};

export const getFixtureVault = (id: string) =>
  id === VAULT_ID ? fixtureVault : undefined;

export const getFixtureStreamRecords = (streamCode: string) =>
  fixtureRecords[streamCode];

export const getFixtureRecord = (id: string) =>
  Object.values(fixtureRecords)
    .flat()
    .find((attachment) => attachment.id === id);
