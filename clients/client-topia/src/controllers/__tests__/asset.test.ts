import { assets } from "../../__mocks__";
import { Asset } from "..";

afterEach(() => {
  jest.resetAllMocks();
});

describe("Asset Class", () => {
  it("should return an array of assets owned by specific email address", async () => {
    const testAsset = new Asset("", "key");
    testAsset.fetchAssetsByEmail = jest.fn().mockReturnValue(assets);
    const mockAssets = await testAsset.fetchAssetsByEmail("lina@topia.io");
    expect(testAsset.fetchAssetsByEmail).toHaveBeenCalled();
    expect(mockAssets).toBeDefined();
  });
});