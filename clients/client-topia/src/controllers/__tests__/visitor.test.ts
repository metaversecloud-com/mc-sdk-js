import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { visitors } from "../../__mocks__";
import { Visitor, Topia } from "controllers";
import { VisitorFactory } from "factories";

const BASE_URL = "https://api.topia.io/api/world/magic";
const id = visitors["1"].playerId;

describe("World Class", () => {
  let mock: MockAdapter, testVisitor: Visitor;
  const myTopiaInstance = new Topia({
    apiDomain: "api.topia.io",
    apiKey: "key",
  });
  const Visitor = new VisitorFactory(myTopiaInstance);

  beforeEach(() => {
    mock = new MockAdapter(axios);
    testVisitor = Visitor.create(id, { options: {}, urlSlug: "magic" });
  });

  afterEach(() => {
    mock.restore();
    jest.resetAllMocks();
  });

  it("should move a list of visitors to uniquely specified coordinates", async () => {
    mock.onPut(`${BASE_URL}/world/magic/visitors/${id}/move`).reply(200, "Success!");
    await testVisitor.moveVisitor({
      shouldTeleportVisitor: true,
      x: 100,
      y: 100,
    });
    expect(mock.history.put.length).toBe(2);
  });
});
