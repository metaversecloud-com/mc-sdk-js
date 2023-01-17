import MockAdapter from "axios-mock-adapter";
import { visitors, worlds } from "../../__mocks__";
import { Visitor, World as WorldClass, Topia } from "controllers";
import { VisitorType } from "types";
import { WorldFactory } from "factories";

const BASE_URL = "https://api.topia.io/api/world/exampleWorld";
const urlSlug = worlds[1].urlSlug;

describe("World Class", () => {
  let mock: MockAdapter, testWorld: WorldClass, topia: Topia, World: WorldFactory;

  beforeEach(() => {
    topia = new Topia({
      apiDomain: "api.topia.io",
      apiKey: "key",
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

  it("should move all visitors within a world to a single set of coordinates", async () => {
    mock.onGet(`${BASE_URL}/visitors`).reply(200, visitors);
    mock.onPut(`${BASE_URL}/visitors/1/move`).reply(200);
    const attributes = {
      shouldFetchVisitors: true,
      shouldTeleportVisitors: true,
      scatterVisitorsBy: 100,
      x: 20,
      y: 40,
    };
    await testWorld.moveAllVisitors(attributes);
    expect(mock.history.put.length).toBe(Object.keys(visitors).length);
  });

  it("should return success if world doesn't have visitors", async () => {
    const attributes = { shouldFetchVisitors: false, scatterVisitorsBy: 100, x: 20, y: 40 };
    await testWorld.moveAllVisitors(attributes);
    expect(mock.history.put.length).toBe(0);
  });

  it("should move a list of visitors to uniquely specified coordinates", async () => {
    mock.onPut(`${BASE_URL}/visitors/1/move`).reply(200);
    const v1 = new Visitor(topia, visitors["1"].playerId, urlSlug, { attributes: visitors["1"] as VisitorType });
    const v2 = new Visitor(topia, visitors["2"].playerId, urlSlug, { attributes: visitors["2"] as VisitorType });
    const testVisitors = [
      { visitorObj: v1, shouldTeleportVisitor: true, x: 0, y: 0 },
      { visitorObj: v2, shouldTeleportVisitor: false, x: 100, y: 100 },
    ];
    await testWorld.moveVisitors(testVisitors);
    expect(mock.history.put.length).toBe(2);
  });
});
