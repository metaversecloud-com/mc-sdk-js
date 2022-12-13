import { scatterVisitors } from "../scatterVisitors";

afterEach(() => {
  jest.resetAllMocks();
});

describe("Visitor Class", () => {
  it("should create an instance of Visitor", () => {
    const testScatter = scatterVisitors(10, 50);
    expect(testScatter).toBeGreaterThan(-40);
    expect(testScatter).toBeLessThan(60);
  });
});
