import { Visitor } from "controllers";
import { visitor } from "../../__mocks__/visitors";

afterEach(() => {
  jest.resetAllMocks();
});

describe("Visitor Class", () => {
  it("should create an instance of Visitor", async () => {
    const testVisitor = new Visitor({
      apiKey: "key",
      args: visitor,
      urlSlug: "magic",
    });
    expect(testVisitor.playerId).toEqual(1);
  });
});
