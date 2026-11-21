import MockAdapter from "axios-mock-adapter";
import { visitor } from "__mocks__";
import { Visitor as VisitorClass, Topia } from "controllers";
import { VisitorFactory } from "factories";

const apiDomain = "api.topia.io";
const id = visitor.visitorId;
const urlSlug = "exampleUrlSlug";

describe("Visitor Class", () => {
  let mock: MockAdapter, testVisitor: VisitorClass, topia: Topia, Visitor: VisitorFactory;

  beforeEach(() => {
    topia = new Topia({
      apiDomain,
      apiKey: "key",
      apiProtocol: "https",
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
    mock.onGet(`https://${apiDomain}/api/v1/world/${urlSlug}/visitors/${id}`).reply(200, visitor);
    await testVisitor.fetchVisitor();
    expect(mock.history.get.length).toBe(1);
  });

  it("should fetch user group data objects", async () => {
    mock
      .onGet(`https://${apiDomain}/api/v1/world/${urlSlug}/visitors/${id}/user-group-data-object`)
      .reply(200, { success: true, userGroupDataObjects: [{ foo: "bar" }] });
    const result = await testVisitor.fetchUserGroupDataObject();
    expect(mock.history.get.length).toBe(1);
    expect(result).toEqual({ success: true, userGroupDataObjects: [{ foo: "bar" }] });
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

  it("keeps the rest of the visitor data object after updateDataObject", async () => {
    mock.onPut(`https://${apiDomain}/api/v1/world/${urlSlug}/visitors/${id}/update-data-object`).reply(200);
    testVisitor.dataObject = { keep: "me", count: 1 };
    await testVisitor.updateDataObject({ count: 2 });
    expect(testVisitor.dataObject).toEqual({ keep: "me", count: 2 });
  });

  it("replaces the visitor data object after setDataObject", async () => {
    mock.onPut(`https://${apiDomain}/api/v1/world/${urlSlug}/visitors/${id}/set-data-object`).reply(200);
    testVisitor.dataObject = { stale: true };
    await testVisitor.setDataObject({ fresh: true });
    expect(testVisitor.dataObject).toEqual({ fresh: true });
  });
});
