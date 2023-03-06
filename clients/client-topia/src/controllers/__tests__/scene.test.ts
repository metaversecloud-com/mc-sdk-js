import { Scene as SceneClass } from "controllers";
import MockAdapter from "axios-mock-adapter";
import { SceneFactory } from "factories";
import { Topia } from "controllers/Topia";
import { scenes } from "__mocks__";

const apiDomain = "api.topia.io";

describe("Scene Class", () => {
  let Scene: SceneFactory, mock: MockAdapter, testScene: SceneClass, topia: Topia;

  beforeEach(async () => {
    topia = new Topia({
      apiDomain,
      apiKey: "exampleKey",
      apiProtocol: "https",
      interactiveKey: "key",
      interactiveSecret: "secret",
    });
    mock = new MockAdapter(topia.axios);
    Scene = new SceneFactory(topia);
    testScene = Scene.create(scenes[0].id);
  });

  afterEach(() => {
    mock.restore();
    jest.resetAllMocks();
  });

  it("should return a scene by id", async () => {
    mock.onGet(`https://${apiDomain}/api/v1/scenes/${scenes[0].id}`).reply(200);
    await testScene.fetchSceneById();
    expect(mock.history.get.length).toBe(1);
  });
});
