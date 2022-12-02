import { visitors, worlds } from "../../__mocks__";
import { World } from "../../controllers";
import { VisitorType } from "../../types";

afterEach(() => {
  jest.resetAllMocks();
});

describe("get world details", () => {
  it("should return details of a world", async () => {
    const testWorld = await new World("key", "lina");
    testWorld.fetchDetails = jest.fn().mockReturnValue(worlds[1]);
    const mockDetails = await testWorld.fetchDetails();
    expect(testWorld.fetchDetails).toHaveBeenCalled();
    expect(mockDetails).toBeDefined();
  });
});

describe("get and move visitors", () => {
  it("should return a list of current visitors for a given world", async () => {
    const testWorld = await new World("key", "lina");
    testWorld.fetchVisitors = jest.fn().mockReturnValue(visitors);
    const mockVisitors = await testWorld.fetchVisitors();
    expect(testWorld.fetchVisitors).toHaveBeenCalled();
    expect(mockVisitors).toBeDefined();
  });

  it("should move a visitor to specified coordinates", async () => {
    // TODO: mock axios and spy on times called
    const testWorld = await new World("key", "lina");
    testWorld.moveVisitors = jest.fn();
    const visitors: Array<VisitorType> = [
      {
        id: "1",
        coordinates: {
          x: 100,
          y: 100,
        },
      },
      {
        id: "2",
        coordinates: {
          x: 200,
          y: 200,
        },
      },
    ];
    await testWorld.moveVisitors(visitors);
    expect(testWorld.moveVisitors).toHaveBeenCalled();
  });
});
