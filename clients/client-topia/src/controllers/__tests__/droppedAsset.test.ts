import { droppedAssets } from "__mocks__";
import { DroppedAsset as DroppedAssetClass, Topia } from "controllers";
import { DroppedAssetClickType, DroppedAssetMediaType } from "types";
import MockAdapter from "axios-mock-adapter";
import { DroppedAssetFactory } from "factories";

const apiDomain = "api.topia.io";
const attributes = droppedAssets[0];
const BASE_URL = `https://api.topia.io/api/world/exampleWorld/assets/${droppedAssets[0].id}`;
const id = droppedAssets[0].id;

describe("DroppedAsset Class", () => {
  let DroppedAsset: DroppedAssetFactory, mock: MockAdapter, testDroppedAsset: DroppedAssetClass, topia: Topia;

  beforeEach(async () => {
    topia = new Topia({
      apiDomain,
      apiKey: "key",
    });
    mock = new MockAdapter(topia.axios);
    DroppedAsset = new DroppedAssetFactory(topia);
    testDroppedAsset = await DroppedAsset.create(id, "exampleWorld");
  });

  afterEach(() => {
    mock.restore();
    jest.resetAllMocks();
  });

  it("should fetch dropped asset by id", async () => {
    mock.onGet(BASE_URL).reply(200, droppedAssets[0]);
    await testDroppedAsset.fetchDroppedAssetById();
    expect(mock.history.get.length).toBe(1);
    expect(testDroppedAsset.urlSlug).toBeDefined();
  });

  it("should update dropped asset broadcast zone", async () => {
    mock.onPut(`${BASE_URL}/set-asset-broadcast`).reply(200);
    const broadcastArgs = {
      ...attributes,
      assetBroadcast: true,
      assetBroadcastAll: false,
      broadcasterEmail: "test@test.com",
    };
    await testDroppedAsset.updateBroadcast(broadcastArgs);
    expect(mock.history.put.length).toBe(1);
  });

  it("should update dropped asset click type", async () => {
    mock.onPut(`${BASE_URL}/change-click-type`).reply(200);
    const clickTypeArgs = {
      ...attributes,
      clickType: DroppedAssetClickType.LINK,
      clickableLink: "www.test.com",
      clickableLinkTitle: "Test",
      clickableDisplayTextDescription: "Description",
      clickableDisplayTextHeadline: "Title",
      portalName: "Test",
      position: {
        x: 0,
        y: 0,
      },
    };
    await testDroppedAsset.updateClickType(clickTypeArgs);
    expect(mock.history.put.length).toBe(1);
  });

  it("should update dropped asset custom text", async () => {
    mock.onPut(`${BASE_URL}/set-custom-text`).reply(200);
    await testDroppedAsset.updateCustomTextAsset({ textColor: "#abc123" }, "hello world");
    expect(mock.history.put.length).toBe(1);
  });

  it("should update dropped asset media type", async () => {
    mock.onPut(`${BASE_URL}/change-media-type`).reply(200);
    const mediaTypeArgs = {
      ...attributes,
      audioRadius: 0,
      audioVolume: -1,
      isVideo: true,
      mediaLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      mediaName: "string",
      mediaType: DroppedAssetMediaType.LINK,
      portalName: "community",
      syncUserMedia: true,
    };
    await testDroppedAsset.updateMediaType(mediaTypeArgs);
    expect(mock.history.put.length).toBe(1);
  });

  it("should update dropped asset mute zone", async () => {
    mock.onPut(`${BASE_URL}/set-mute-zone`).reply(200);
    await testDroppedAsset.updateMuteZone(true);
    expect(mock.history.put.length).toBe(1);
  });

  it("should update dropped asset position", async () => {
    mock.onPut(`${BASE_URL}/set-position`).reply(200);
    await testDroppedAsset.updatePosition(100, 100);
    expect(mock.history.put.length).toBe(1);
  });

  it("should update dropped asset private zone", async () => {
    mock.onPut(`${BASE_URL}/set-private-zone`).reply(200);
    const privateZoneArgs = {
      ...attributes,
      isPrivateZone: true,
      isPrivateZoneChatDisabled: false,
      privateZoneUserCap: 10,
    };
    await testDroppedAsset.updatePrivateZone(privateZoneArgs);
    expect(mock.history.put.length).toBe(1);
  });

  it("should update dropped asset scale", async () => {
    mock.onPut(`${BASE_URL}/change-scale`).reply(200);
    await testDroppedAsset.updateScale(75);
    expect(mock.history.put.length).toBe(1);
  });

  it("should update dropped asset uploaded media selected", async () => {
    mock.onPut(`${BASE_URL}/change-uploaded-media-selected`).reply(200);
    await testDroppedAsset.updateUploadedMediaSelected("abc123");
    expect(mock.history.put.length).toBe(1);
  });

  it("should update dropped asset web image layers", async () => {
    mock.onPut(`${BASE_URL}/set-webimage-layers`).reply(200);
    await testDroppedAsset.updateWebImageLayers("test", "test");
    expect(mock.history.put.length).toBe(1);
  });
});
