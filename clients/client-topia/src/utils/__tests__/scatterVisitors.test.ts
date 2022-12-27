import { scatterVisitors } from "../scatterVisitors";

afterEach(() => {
  jest.resetAllMocks();
});

describe("scatter visitors util", () => {
  it("should scatter visitors by 50", () => {
    const testScatter = scatterVisitors(10, 50);
    expect(testScatter).toBeGreaterThanOrEqual(-40);
    expect(testScatter).toBeLessThanOrEqual(60);
  });
});
