import { Visitor } from "..";

afterEach(() => {
  jest.resetAllMocks();
});

describe("Visitor Class", () => {
  it("should return an array of assets owned by specific email address", async () => {
    const testVisitor = await new Visitor(
      "apiKey",
      "",
      "displayName",
      0,
      false,
      false,
      false,
      false,
      false,
      false,
      undefined,
      undefined,
      undefined,
      { x: 100, y: 100 },
      false,
      false,
      false,
      1,
      false,
      false,
      "lina",
      "",
    );
    expect(testVisitor.displayName).toEqual("displayName");
  });
});
