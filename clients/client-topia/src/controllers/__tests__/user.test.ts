import MockAdapter from "axios-mock-adapter";
import { droppedAssets, scenes, worlds } from "__mocks__";
import { User as UserClass, Topia } from "controllers";
import { UserFactory } from "factories";

const apiDomain = "api.topia.io";

describe("User Class", () => {
  let mock: MockAdapter, testUser: UserClass, topia: Topia, User: UserFactory;

  beforeEach(() => {
    topia = new Topia({
      apiDomain,
      apiKey: "key",
    });
    mock = new MockAdapter(topia.axios);
    User = new UserFactory(topia);
    testUser = User.create({ email: "test@email.com", urlSlug: "exampleWorld", visitorId: 1 });
  });

  afterEach(() => {
    mock.restore();
    jest.resetAllMocks();
  });

  it("should update user with details when", async () => {
    mock.onGet(`https://${apiDomain}/api/world/exampleWorld/visitors/1`).reply(200, worlds);
    await testUser.fetchUserByVisitorId();
    expect(mock.history.get.length).toBe(1);
  });

  it("should update user.worlds", async () => {
    mock.onGet(`https://${apiDomain}/api/user/worlds`).reply(200, worlds);
    await testUser.fetchWorldsByKey();
    expect(mock.history.get.length).toBe(1);
    expect(Object.keys(testUser.worlds).length).toBe(Object.keys(worlds).length);
  });

  it("should return an array of scenes owned by specific email address", async () => {
    testUser.fetchScenes = jest.fn().mockReturnValue(scenes);
    const mockScenes = await testUser.fetchScenes();
    expect(testUser.fetchScenes).toHaveBeenCalled();
    expect(mockScenes).toBeDefined();
  });

  it("should return an array of assets owned by specific email address", async () => {
    testUser.fetchAssetsByEmail = jest.fn().mockReturnValue(droppedAssets);
    const mockAssets = await testUser.fetchAssetsByEmail("lina@topia.io");
    expect(testUser.fetchAssetsByEmail).toHaveBeenCalled();
    expect(mockAssets).toBeDefined();
  });
});
