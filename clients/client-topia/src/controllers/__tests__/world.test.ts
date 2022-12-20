import { visitors, worlds } from "../../__mocks__";
import { Visitor, World } from "../../controllers";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { createVisitor } from "utils";
import { VisitorType } from "types";

const BASE_URL = "https://api.topia.io/api/world/magic";

describe("World Class", () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
    jest.resetAllMocks();
  });

  it("should return details of a world", async () => {
    const testWorld = await new World("key", "magic");
    expect(testWorld.urlSlug).toEqual("magic");

    testWorld.fetchDetails = jest.fn().mockReturnValue(worlds[1]);
    const mockDetails = await testWorld.fetchDetails();
    expect(testWorld.fetchDetails).toHaveBeenCalled();
    expect(mockDetails).toBeDefined();
  });

  it("should move all visitors within a world to a single set of coordinates", async () => {
    mock.onGet(`${BASE_URL}/visitors`).reply(200, visitors);
    mock.onPut(`${BASE_URL}/visitors/1/move`).reply(200, "Success!");
    const testWorld = await new World("key", "magic");
    const args = { shouldFetchVisitors: true, shouldTeleportVisitors: true, scatterVisitorsBy: 100, x: 20, y: 40 };
    await testWorld.moveAllVisitors(args);
    expect(mock.history.put.length).toBe(Object.keys(visitors).length);
  });

  it("should return success if world doesn't have visitors", async () => {
    const testWorld = await new World("key", "magic");
    const args = { shouldFetchVisitors: false, scatterVisitorsBy: 100, x: 20, y: 40 };
    await testWorld.moveAllVisitors(args);
    expect(mock.history.put.length).toBe(0);
  });

  it("should move a list of visitors to uniquely specified coordinates", async () => {
    mock.onPut(`${BASE_URL}/visitors/1/move`).reply(200, "Success!");
    const testWorld = await new World("key", "magic");
    const v1 = createVisitor(Visitor, "key", visitors["1"] as VisitorType, "magic");
    const v2 = createVisitor(Visitor, "key", visitors["2"], "magic");
    const testVisitors = [
      { visitorObj: v1, shouldTeleportVisitor: true, x: 0, y: 0 },
      { visitorObj: v2, shouldTeleportVisitor: false, x: 100, y: 100 },
    ];
    await testWorld.moveVisitors(testVisitors);
    expect(mock.history.put.length).toBe(2);
  });
});
