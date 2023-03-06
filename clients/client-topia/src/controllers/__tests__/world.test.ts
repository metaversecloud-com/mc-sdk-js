import MockAdapter from "axios-mock-adapter";
import { worlds } from "__mocks__";
import { World as WorldClass, Topia } from "controllers";
import { WorldFactory } from "factories";

const urlSlug = worlds[1].urlSlug;

describe("World Class", () => {
  let mock: MockAdapter, testWorld: WorldClass, topia: Topia, World: WorldFactory;

  beforeEach(() => {
    topia = new Topia({
      apiDomain: "api.topia.io",
      apiKey: "key",
      apiProtocol: "https",
    });
    mock = new MockAdapter(topia.axios);
    World = new WorldFactory(topia);
    testWorld = World.create(urlSlug);
  });

  afterEach(() => {
    mock.restore();
    jest.resetAllMocks();
  });

  it("should return details of a world", async () => {
    expect(testWorld.urlSlug).toEqual("exampleWorld");
    testWorld.fetchDetails = jest.fn().mockReturnValue(worlds[1]);
    const mockDetails = await testWorld.fetchDetails();
    expect(testWorld.fetchDetails).toHaveBeenCalled();
    expect(mockDetails).toBeDefined();
  });

  // it("should update details of a world", async () => {
  //   mock.onPut(`${BASE_URL}/world-details`).reply(200);
  //   const worldArgs = {
  //     controls: {
  //       allowMuteAll: false,
  //     },
  //     description: "testing update details",
  //     name: "exampleWorld",
  //   };
  //   await testWorld.updateDetails(worldArgs);
  //   expect(mock.history.put.length).toBe(1);
  //   expect(testWorld.urlSlug).toEqual("exampleWorld");
  // });
});
