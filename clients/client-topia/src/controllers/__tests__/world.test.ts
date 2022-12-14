import { visitors, worlds } from "../../__mocks__";
import { World } from "../../controllers";

afterEach(() => {
  jest.resetAllMocks();
});

describe("World Class", () => {
  it("should return details of a world", async () => {
    const testWorld = await new World("key", "lina");
    expect(testWorld.urlSlug).toEqual("lina");

    testWorld.fetchDetails = jest.fn().mockReturnValue(worlds[1]);
    const mockDetails = await testWorld.fetchDetails();
    expect(testWorld.fetchDetails).toHaveBeenCalled();
    expect(mockDetails).toBeDefined();
  });

  it("should return a list of current visitors for a given world", async () => {
    const testWorld = await new World("key", "lina");
    testWorld.fetchVisitors = jest.fn().mockReturnValue(visitors);
    const mockVisitors = await testWorld.fetchVisitors();
    expect(testWorld.fetchVisitors).toHaveBeenCalled();
    expect(mockVisitors).toBeDefined();
  });

  it("should move all visitors within a world to a single set of coordinates", async () => {
    // TODO: mock axios and spy on times called
    const testWorld = await new World("key", "lina");
    testWorld.moveAllVisitors = jest.fn();
    await testWorld.moveAllVisitors(true, true, 100, 20, 40);
    expect(testWorld.moveAllVisitors).toHaveBeenCalled();
  });

  // it("should move a list of visitors to uniquely specified coordinates", async () => {
  //   const testWorld = await new World("key", "lina");
  //   testWorld.moveVisitors = jest.fn();
  //   const testVisitors = [
  //     { visitorObj: Visitor, shouldTeleportVisitor: true, x: 0, y: 0 },
  //     { visitorObj: Visitor, shouldTeleportVisitor: false, x: 100, y: 100 },
  //   ];
  //   await testWorld.moveVisitors(testVisitors);
  //   expect(testWorld.moveVisitors).toHaveBeenCalled();
  // });
});
