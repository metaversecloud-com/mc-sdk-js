import { scenes } from "__mocks__";
import { User } from "controllers";

afterEach(() => {
  jest.resetAllMocks();
});

describe("User Class", () => {
  it("should return an array of scenes owned by specific email address", async () => {
    const testUser = await new User({ apiKey: "key", email: "test@email.com" });
    testUser.fetchScenesByEmail = jest.fn().mockReturnValue(scenes);
    const mockScenes = await testUser.fetchScenesByEmail();
    expect(testUser.fetchScenesByEmail).toHaveBeenCalled();
    expect(mockScenes).toBeDefined();
  });
});
