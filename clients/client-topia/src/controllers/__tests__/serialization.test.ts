import { droppedAssets } from "__mocks__";
import { Topia } from "controllers";
import MockAdapter from "axios-mock-adapter";
import { DroppedAssetFactory, VisitorFactory, WorldFactory } from "factories";

const SECRET = "interactive-secret-value";
const NONCE = "nonce-value";
const credentials = {
  assetId: droppedAssets[0].id,
  interactiveNonce: NONCE,
  interactivePublicKey: "public-key",
  urlSlug: "exampleUrlSlug",
  visitorId: 1,
};

describe("SDK objects don't serialize their secrets", () => {
  let mock: MockAdapter, topia: Topia;

  beforeEach(() => {
    topia = new Topia({ apiDomain: "api.topia.io", interactiveKey: "public-key", interactiveSecret: SECRET });
    mock = new MockAdapter(topia.axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it("JSON, spread and Object.keys leave out the client, credentials and JWT", () => {
    const objects = [
      new DroppedAssetFactory(topia).create(droppedAssets[0].id, "exampleUrlSlug", { credentials }),
      new VisitorFactory(topia).create(1, "exampleUrlSlug", { credentials }),
      new WorldFactory(topia).create("exampleUrlSlug", { credentials }),
    ];
    for (const object of objects) {
      const jwt = object.jwt as string;
      expect(jwt).toBeTruthy();
      for (const serialized of [JSON.stringify(object), JSON.stringify({ ...object })]) {
        expect(serialized).not.toContain(SECRET);
        expect(serialized).not.toContain(jwt);
        expect(serialized).not.toContain(NONCE);
      }
      expect(Object.keys(object)).toEqual(expect.not.arrayContaining(["topia", "credentials", "jwt", "requestOptions"]));
    }
  });

  it("keeps them readable, and requests still carry the signed JWT", async () => {
    const droppedAsset = new DroppedAssetFactory(topia).create(droppedAssets[0].id, "exampleUrlSlug", { credentials });
    expect(droppedAsset.topia.interactiveSecret).toBe(SECRET);
    expect(droppedAsset.credentials).toEqual(credentials);

    mock.onGet(`https://api.topia.io/api/v1/world/exampleUrlSlug/assets/${droppedAssets[0].id}`).reply(200, droppedAssets[0]);
    await droppedAsset.fetchDroppedAssetById();
    expect(mock.history.get[0].headers?.InteractiveJWT).toBe(droppedAsset.jwt);
    expect(JSON.stringify(droppedAsset)).not.toContain(SECRET);
  });

  it("getWithUniqueName's error doesn't carry the secret", async () => {
    mock.onGet(/asset-by-unique-name/).reply(404, { errors: [{ message: "not found" }] });
    const error = await new DroppedAssetFactory(topia)
      .getWithUniqueName("missing", "exampleUrlSlug", SECRET, credentials)
      .catch((e) => e);
    expect(error.status).toBe(404);
    expect(JSON.stringify(error)).not.toContain(SECRET);
  });
});
