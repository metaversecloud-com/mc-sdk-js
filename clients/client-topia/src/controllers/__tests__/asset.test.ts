import { Asset as AssetClass } from "controllers";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { AssetFactory } from "factories";
import Topia from "controllers/Topia";

afterEach(() => {
  jest.resetAllMocks();
});

describe("Asset Class", () => {
  const apiDomain = "api.topia.io";
  let mock: MockAdapter, testAsset: AssetClass;

  const topia = new Topia({
    apiDomain: "api.topia.io",
    apiKey: "exampleKey",
    interactiveKey: "key",
    interactiveSecret: "secret",
  });
  const Asset = new AssetFactory(topia);

  beforeEach(async () => {
    mock = new MockAdapter(axios);
    testAsset = Asset.create("test", { options: {} });
  });

  afterEach(() => {
    mock.restore();
    jest.resetAllMocks();
  });

  it("should return an array of assets owned by specific email address", async () => {
    mock.onGet(`${apiDomain}/assets/topia-assets`).reply(200, "Success!");
    await testAsset.fetchPlatformAssets();
    expect(mock.history.get.length).toBe(1);
  });
});
