import axios from "axios";
import { World } from "../..";
import { visitors, worlds } from "../../../__mocks__";

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
    const testWorld = await new World("key", "lina");
    testWorld.moveVisitor = jest.fn();
    const visitor = {
      visitorId: "798",
      coordinates: {
        x: 100,
        y: 100,
      },
    };
    await testWorld.moveVisitor(visitor);
    expect(testWorld.moveVisitor).toHaveBeenCalled();
  });
});
