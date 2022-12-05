import { assets } from "../../__mocks__";
import { Asset } from "..";

afterEach(() => {
  jest.resetAllMocks();
});

describe("get my assets", () => {
  it("should return an array of assets owned by specific email address", async () => {
    const testAsset = await new Asset("key", "lina@topia.io");
    testAsset.fetchMyAssets = jest.fn().mockReturnValue(assets);
    const mockAssets = await testAsset.fetchMyAssets();
    expect(testAsset.fetchMyAssets).toHaveBeenCalled();
    expect(mockAssets).toBeDefined();
  });
});
