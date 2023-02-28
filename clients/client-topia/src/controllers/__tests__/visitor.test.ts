import MockAdapter from "axios-mock-adapter";
import { visitor } from "__mocks__";
import { Visitor as VisitorClass, Topia } from "controllers";
import { VisitorFactory } from "factories";

const apiDomain = "api.topia.io";
const id = visitor.playerId;
const urlSlug = "exampleWorld";

describe("Visitor Class", () => {
  let mock: MockAdapter, testVisitor: VisitorClass, topia: Topia, Visitor: VisitorFactory;

  beforeEach(() => {
    topia = new Topia({
      apiDomain,
      apiKey: "key",
    });
    mock = new MockAdapter(topia.axios);
    Visitor = new VisitorFactory(topia);
    testVisitor = Visitor.create(id, urlSlug);
  });

  afterEach(() => {
    mock.restore();
    jest.resetAllMocks();
  });

  it("should update visitor details", async () => {
    mock.onGet(`https://${apiDomain}/api/v1/world/exampleWorld/visitors/1`).reply(200, visitor);
    await testVisitor.fetchVisitor();
    expect(mock.history.get.length).toBe(1);
  });

  it("should move a list of visitors to uniquely specified coordinates", async () => {
    mock.onPut(`https://${apiDomain}/api/v1/world/${urlSlug}/visitors/${id}/move`).reply(200);
    await testVisitor.moveVisitor({
      shouldTeleportVisitor: true,
      x: 100,
      y: 100,
    });
    expect(mock.history.put.length).toBe(1);
  });
});
