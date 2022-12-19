import { droppedAssets } from "__mocks__";
import { DroppedAsset } from "..";
import { DroppedAssetClickType } from "../../types/DroppedAssetTypes";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

describe("DroppedAsset Class", () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
    jest.resetAllMocks();
  });

  it("should fetch dropped asset by id", async () => {
    const testDroppedAsset = new DroppedAsset("key", { id: droppedAssets[0].id }, "", "magic");
    testDroppedAsset.fetchDroppedAssetById = jest.fn().mockReturnValue(droppedAssets[0]);
    const mockDroppedAssets = await testDroppedAsset.fetchDroppedAssetById();
    expect(testDroppedAsset.fetchDroppedAssetById).toHaveBeenCalled();
    expect(mockDroppedAssets).toBeDefined();
  });

  it("should update dropped asset", async () => {
    mock
      .onPut(`https://api.topia.io/api/world/magic/assets/${droppedAssets[0].id}/change-click-type`)
      .reply(200, "Success!");

    const testDroppedAsset = new DroppedAsset("key", { id: droppedAssets[0].id }, "", "magic");
    await testDroppedAsset.changeClickType(DroppedAssetClickType.LINK, "www.test.com", "Test", "Test", {
      x: 0,
      y: 0,
    });
    expect(mock.history.put.length).toBe(1);
  });
});
