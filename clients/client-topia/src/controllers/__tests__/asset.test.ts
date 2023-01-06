import { assets } from "../../__mocks__";
import { Asset } from "..";

afterEach(() => {
  jest.resetAllMocks();
});

describe("Asset Class", () => {
  it("should return an array of assets owned by specific email address", async () => {
    const testAsset = new Asset({ apiKey: "key", args: { id: "abc123" } });
    testAsset.fetchPlatformAssets = jest.fn().mockReturnValue(assets);
    const mockAssets = await testAsset.fetchPlatformAssets();
    expect(testAsset.fetchPlatformAssets).toHaveBeenCalled();
    expect(mockAssets).toBeDefined();
  });
});
