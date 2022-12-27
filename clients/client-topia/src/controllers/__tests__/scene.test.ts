import { scenes } from "../../__mocks__";
import { Scene } from "..";

afterEach(() => {
  jest.resetAllMocks();
});

describe("Scene Class", () => {
  it("should return an array of scenes owned by specific email address", async () => {
    const testScene = await new Scene({ apiKey: "key" });
    testScene.fetchScenesByEmail = jest.fn().mockReturnValue(scenes);
    const mockScenes = await testScene.fetchScenesByEmail("lina@topia.io");
    expect(testScene.fetchScenesByEmail).toHaveBeenCalled();
    expect(mockScenes).toBeDefined();
  });
});
