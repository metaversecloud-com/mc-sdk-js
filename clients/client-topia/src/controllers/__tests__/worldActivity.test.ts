import MockAdapter from "axios-mock-adapter";
import { visitors, worlds } from "__mocks__";
import { Visitor, WorldActivity as WorldActivityActivityClass, Topia } from "controllers";
import { VisitorType } from "types";
import { WorldActivityFactory } from "factories";

const BASE_URL = "https://api.topia.io/api/world/exampleWorld";
const urlSlug = worlds[1].urlSlug;

describe("WorldActivity Class", () => {
  let mock: MockAdapter,
    testWorldActivity: WorldActivityActivityClass,
    topia: Topia,
    WorldActivity: WorldActivityFactory;

  beforeEach(() => {
    topia = new Topia({
      apiDomain: "api.topia.io",
      apiKey: "key",
    });
    mock = new MockAdapter(topia.axios);
    WorldActivity = new WorldActivityFactory(topia);
    testWorldActivity = WorldActivity.create(urlSlug);
  });

  afterEach(() => {
    mock.restore();
    jest.resetAllMocks();
  });

  it("should move all visitors within a world to a single set of coordinates", async () => {
    mock.onGet(`${BASE_URL}/visitors`).reply(200, visitors);
    mock.onPut(`${BASE_URL}/visitors/1/move`).reply(200);
    mock.onPut(`${BASE_URL}/visitors/2/move`).reply(200);
    const attributes = {
      shouldFetchVisitors: true,
      shouldTeleportVisitors: true,
      scatterVisitorsBy: 100,
      x: 20,
      y: 40,
    };
    await testWorldActivity.moveAllVisitors(attributes);
    expect(mock.history.put.length).toBe(Object.keys(visitors).length);
  });

  it("should return success if world doesn't have visitors", async () => {
    const attributes = { shouldFetchVisitors: false, scatterVisitorsBy: 100, x: 20, y: 40 };
    await testWorldActivity.moveAllVisitors(attributes);
    expect(mock.history.put.length).toBe(0);
  });

  it("should move a list of visitors to uniquely specified coordinates", async () => {
    mock.onPut(`${BASE_URL}/visitors/1/move`).reply(200);
    mock.onPut(`${BASE_URL}/visitors/2/move`).reply(200);
    const v1 = new Visitor(topia, visitors["1"].playerId, urlSlug, { attributes: visitors["1"] as VisitorType });
    const v2 = new Visitor(topia, visitors["2"].playerId, urlSlug, { attributes: visitors["2"] as VisitorType });
    const testVisitors = [
      { visitorObj: v1, shouldTeleportVisitor: true, x: 0, y: 0 },
      { visitorObj: v2, shouldTeleportVisitor: false, x: 100, y: 100 },
    ];
    await testWorldActivity.moveVisitors(testVisitors);
    expect(mock.history.put.length).toBe(2);
  });
});
