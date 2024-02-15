import { Asset as AssetClass } from "controllers";
import MockAdapter from "axios-mock-adapter";
import { AssetFactory } from "factories";
import { Topia } from "controllers/Topia";

const apiDomain = "api.topia.io";

describe("Asset Class", () => {
  let Asset: AssetFactory, mock: MockAdapter, testAsset: AssetClass, topia: Topia;

  beforeEach(async () => {
    topia = new Topia({
      apiDomain,
      apiKey: "exampleKey",
      apiProtocol: "https",
      interactiveKey: "key",
      interactiveSecret: "secret",
    });
    mock = new MockAdapter(topia.axios);
    Asset = new AssetFactory(topia);
    testAsset = Asset.create("test");
  });

  afterEach(() => {
    mock.restore();
    jest.resetAllMocks();
  });

  it("should return an array of assets owned by specific email address", async () => {
    mock.onGet(`https://${apiDomain}/api/v1/assets/${testAsset.id}`).reply(200);
    await testAsset.fetchAssetById();
    expect(mock.history.get.length).toBe(1);
  });
});
