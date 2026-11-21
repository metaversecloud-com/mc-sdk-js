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
    expect(testWorld.urlSlug).toEqual("exampleUrlSlug");
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
  //   expect(testWorld.urlSlug).toEqual("exampleUrlSlug");
  // });

  it("keeps the rest of the world data object after updateDataObject", async () => {
    mock.onPut(`https://api.topia.io/api/v1/world/${urlSlug}/update-data-object`).reply(200);
    testWorld.dataObject = { keep: "me", count: 1 };
    await testWorld.updateDataObject({ count: 2 });
    expect(testWorld.dataObject).toEqual({ keep: "me", count: 2 });
  });

  it("replaces the world data object after setDataObject", async () => {
    mock.onPut(`https://api.topia.io/api/v1/world/${urlSlug}/set-data-object`).reply(200);
    testWorld.dataObject = { stale: true };
    await testWorld.setDataObject({ fresh: true });
    expect(testWorld.dataObject).toEqual({ fresh: true });
  });
});
