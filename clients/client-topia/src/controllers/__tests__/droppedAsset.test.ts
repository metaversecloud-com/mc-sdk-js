import { droppedAssets } from "__mocks__";
import { DroppedAsset } from "..";
import { DroppedAssetClickType, DroppedAssetMediaType } from "../../types/DroppedAssetTypes";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const BASE_URL = `https://api.topia.io/api/world/magic/assets/${droppedAssets[0].id}`;
const apiKey = "key";
const args = droppedAssets[0];
const id = droppedAssets[0].id;
const urlSlug = "magic";

describe("DroppedAsset Class", () => {
  let mock: MockAdapter, testDroppedAsset: DroppedAsset;

  beforeEach(() => {
    mock = new MockAdapter(axios);
    testDroppedAsset = new DroppedAsset({ apiKey, id, args, urlSlug });
  });

  afterEach(() => {
    mock.restore();
    jest.resetAllMocks();
  });

  it("should fetch dropped asset by id", async () => {
    testDroppedAsset.fetchDroppedAssetById = jest.fn().mockReturnValue(droppedAssets[0]);
    const mockDroppedAssets = await testDroppedAsset.fetchDroppedAssetById();
    expect(testDroppedAsset.fetchDroppedAssetById).toHaveBeenCalled();
    expect(mockDroppedAssets).toBeDefined();
  });

  it("should update dropped asset broadcast zone", async () => {
    mock.onPut(`${BASE_URL}/set-asset-broadcast`).reply(200, "Success!");
    const broadcastArgs = {
      ...args,
      assetBroadcast: true,
      assetBroadcastAll: false,
      broadcasterEmail: "test@test.com",
    };
    await testDroppedAsset.updateBroadcast(broadcastArgs);
    expect(mock.history.put.length).toBe(1);
  });

  it("should update dropped asset click type", async () => {
    mock.onPut(`${BASE_URL}/change-click-type`).reply(200, "Success!");
    const clickTypeArgs = {
      ...args,
      clickType: DroppedAssetClickType.LINK,
      clickableLink: "www.test.com",
      clickableLinkTitle: "Test",
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
    mock.onPut(`${BASE_URL}/set-custom-text`).reply(200, "Success!");
    await testDroppedAsset.updateCustomText({ textColor: "#abc123" }, "hello world");
    expect(mock.history.put.length).toBe(1);
  });

  it("should update dropped asset media type", async () => {
    mock.onPut(`${BASE_URL}/change-media-type`).reply(200, "Success!");
    const mediaTypeArgs = {
      ...args,
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
    mock.onPut(`${BASE_URL}/set-mute-zone`).reply(200, "Success!");
    await testDroppedAsset.updateMuteZone(true);
    expect(mock.history.put.length).toBe(1);
  });

  it("should update dropped asset position", async () => {
    mock.onPut(`${BASE_URL}/set-position`).reply(200, "Success!");
    await testDroppedAsset.updatePosition(100, 100);
    expect(mock.history.put.length).toBe(1);
  });

  it("should update dropped asset private zone", async () => {
    mock.onPut(`${BASE_URL}/set-private-zone`).reply(200, "Success!");
    const privateZoneArgs = {
      ...args,
      isPrivateZone: true,
      isPrivateZoneChatDisabled: false,
      privateZoneUserCap: 10,
    };
    await testDroppedAsset.updatePrivateZone(privateZoneArgs);
    expect(mock.history.put.length).toBe(1);
  });

  it("should update dropped asset scale", async () => {
    mock.onPut(`${BASE_URL}/change-scale`).reply(200, "Success!");
    await testDroppedAsset.updateScale(75);
    expect(mock.history.put.length).toBe(1);
  });

  it("should update dropped asset uploaded media selected", async () => {
    mock.onPut(`${BASE_URL}/change-uploaded-media-selected`).reply(200, "Success!");
    await testDroppedAsset.updateUploadedMediaSelected("abc123");
    expect(mock.history.put.length).toBe(1);
  });

  it("should update dropped asset web image layers", async () => {
    mock.onPut(`${BASE_URL}/set-webimage-layers`).reply(200, "Success!");
    await testDroppedAsset.updateWebImageLayers("test", "test");
    expect(mock.history.put.length).toBe(1);
  });
});