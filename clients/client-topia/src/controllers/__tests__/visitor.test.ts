import { Visitor } from "controllers";
import { createVisitor } from "../../utils/createVisitor";
import { visitor } from "../../__mocks__/visitors";

afterEach(() => {
  jest.resetAllMocks();
});

describe("Visitor Class", () => {
  it("should create an instance of Visitor", async () => {
    const testVisitor = createVisitor(Visitor, "apiKey", visitor, "magic");
    expect(testVisitor.displayName).toEqual("test");
  });
});
