import { describe, expect, it } from "vitest";
import { getIPFSIMGAddr, getIPFSIMGAddrPrivate } from "../utils/getIPFSAddrs";
import {
  fixtureVault,
  getFixtureFileUrl,
  getFixtureRecord,
  getFixtureStreamRecords,
  getFixtureVault,
  isFixtureId,
} from ".";

describe("fixtures", () => {
  it("every stream of the demo vault has records", () => {
    for (const stream of fixtureVault.streams ?? []) {
      expect(
        getFixtureStreamRecords(stream.asset_code!)?.length,
      ).toBeGreaterThan(0);
    }
  });

  it("every fixture file resolves to a bundled URL", () => {
    for (const stream of fixtureVault.streams ?? []) {
      for (const record of getFixtureStreamRecords(stream.asset_code!)) {
        for (const file of record.files ?? []) {
          expect(getFixtureFileUrl(file.cid!)).toBeTruthy();
        }
      }
    }
    expect(getFixtureFileUrl(fixtureVault.image_cid!)).toBeTruthy();
  });

  it("looks the vault and records up by id", () => {
    expect(getFixtureVault(fixtureVault.id)).toBe(fixtureVault);
    const [first] = getFixtureStreamRecords(
      fixtureVault.streams![0].asset_code!,
    );
    expect(getFixtureRecord(first.id)).toBe(first);
    expect(getFixtureVault("real-id")).toBeUndefined();
    expect(getFixtureRecord("real-id")).toBeUndefined();
  });

  it("IPFS helpers serve fixture files locally and leave real CIDs alone", () => {
    const cid = fixtureVault.image_cid!;
    expect(isFixtureId(cid)).toBe(true);
    expect(getIPFSIMGAddr(cid)).toBe(getFixtureFileUrl(cid));
    expect(getIPFSIMGAddrPrivate(cid)).toBe(getFixtureFileUrl(cid));
    expect(getIPFSIMGAddr("bafy123")).toMatch(
      /^https:\/\/bafy123\.ipfs\.pub\./,
    );
  });
});
