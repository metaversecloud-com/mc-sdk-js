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
    testUser = User.create();
  });

  afterEach(() => {
    mock.restore();
    jest.resetAllMocks();
  });

  it("should return a custom auth token", async () => {
    mock.onPost(`https://${apiDomain}/api/v1/auth/custom-token`, { verificationCode: "test" }).reply(200, "abc123");
    await testUser.verifyAuthToken("test");
    expect(mock.history.post.length).toBe(1);
  });

  it("should return an array of assets owned by specific email address", async () => {
    testUser.fetchAssets = jest.fn().mockReturnValue(droppedAssets);
    const mockAssets = await testUser.fetchAssets();
    expect(testUser.fetchAssets).toHaveBeenCalled();
    expect(mockAssets).toBeDefined();
  });

  it("should return an array of scenes owned by specific user", async () => {
    testUser.fetchScenes = jest.fn().mockReturnValue(scenes);
    const mockScenes = await testUser.fetchScenes();
    expect(testUser.fetchScenes).toHaveBeenCalled();
    expect(mockScenes).toBeDefined();
  });

  it("should update user.worlds", async () => {
    mock.onGet(`https://${apiDomain}/api/v1/user/worlds`).reply(200, worlds);
    await testUser.fetchWorldsByKey();
    expect(mock.history.get.length).toBe(1);
    expect(Object.keys(testUser.worlds).length).toBe(Object.keys(worlds).length);
  });
});
