import { Asset as AssetClass } from "controllers";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { AssetFactory } from "factories";
import { Topia } from "controllers/Topia";

const apiDomain = "api.topia.io";

describe("Asset Class", () => {
  let Asset: AssetFactory, mock: MockAdapter, testAsset: AssetClass, topia: Topia;

  beforeEach(async () => {
    mock = new MockAdapter(axios);
    topia = new Topia({
      apiDomain: "api.topia.io",
      apiKey: "exampleKey",
      interactiveKey: "key",
      interactiveSecret: "secret",
    });
    Asset = new AssetFactory(topia);
    testAsset = Asset.create("test");
  });

  afterEach(() => {
    mock.restore();
    jest.resetAllMocks();
  });

  it("should return an array of assets owned by specific email address", async () => {
    mock.onGet(`https://${apiDomain}/api/assets/topia-assets`).reply(200, "Success!");
    await testAsset.fetchPlatformAssets();
    expect(mock.history.get.length).toBe(1);
  });
});
