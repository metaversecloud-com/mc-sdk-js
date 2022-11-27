import { getWorldDetails } from ".";

describe("getWorldDetails", () => {
  it("should return details of a world", async () => {
    const result = await getWorldDetails("lina");
    expect(result).toBeDefined();
  });
});
