import { removeUndefined } from "../removeUndefined";

afterEach(() => {
  jest.resetAllMocks();
});

describe("remove undefined values util", () => {
  it("should return an object without overriding with undefined values", () => {
    const testRemoveUndefined = removeUndefined({ a: "abc", b: undefined, c: "123", d: null });
    expect(testRemoveUndefined).toEqual({ a: "abc", c: "123", d: null });
  });
});
