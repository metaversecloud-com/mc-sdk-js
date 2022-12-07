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

  it("should move a list of visitors to specified coordinates", async () => {
    // TODO: mock axios and spy on times called
    const testWorld = await new World("key", "lina");
    testWorld.moveVisitors = jest.fn();
    await testWorld.moveVisitors(true, true, 100, 100);
    expect(testWorld.moveVisitors).toHaveBeenCalled();
  });
});
