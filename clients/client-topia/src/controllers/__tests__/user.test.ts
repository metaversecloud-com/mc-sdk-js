import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { droppedAssets, scenes, worlds } from "__mocks__";
import { User } from "controllers";

const BASE_URL = "https://api.topia.io/api/user";
const apiKey = "key";
const email = "test@email.com";

describe("User Class", () => {
  let mock: MockAdapter, testUser: User;

  beforeEach(() => {
    mock = new MockAdapter(axios);
    testUser = new User({ apiKey, email });
  });

  afterEach(() => {
    mock.restore();
    jest.resetAllMocks();
  });

  it("should update user.worlds", async () => {
    mock.onGet(`${BASE_URL}/worlds`).reply(200, worlds);
    await testUser.fetchWorldsByKey();
    expect(mock.history.get.length).toBe(1);
    expect(Object.keys(testUser.worlds).length).toBe(Object.keys(worlds).length);
  });

  it("should return an array of scenes owned by specific email address", async () => {
    testUser.fetchScenesByEmail = jest.fn().mockReturnValue(scenes);
    const mockScenes = await testUser.fetchScenesByEmail();
    expect(testUser.fetchScenesByEmail).toHaveBeenCalled();
    expect(mockScenes).toBeDefined();
  });

  it("should return an array of assets owned by specific email address", async () => {
    testUser.fetchAssetsByEmail = jest.fn().mockReturnValue(droppedAssets);
    const mockAssets = await testUser.fetchAssetsByEmail("lina@topia.io");
    expect(testUser.fetchAssetsByEmail).toHaveBeenCalled();
    expect(mockAssets).toBeDefined();
  });
});