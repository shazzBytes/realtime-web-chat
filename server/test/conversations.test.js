const assert = require("./helpers/assert");
const Conversation = require("../src/models/Conversation.model.js");
const { startTestApp } = require("./helpers/app");
const { createConversation } = require("./helpers/conversations");
const registerUser = require("./utils/register.js");

let app;

beforeAll(async () => {
  app = await startTestApp();
});
beforeEach(async () => {
  await app.resetDatabase();
});
afterAll(async () => {
  await app.close();
});

describe("GET /conversations", () => {
  it("CONV-001: returns only conversations belonging to the authenticated user", async () => {
    const { user: alice, cookies } = await registerUser(app.request, "alice");
    const { user: bob } = await registerUser(app.request, "bob");
    const { user: charlie } = await registerUser(app.request, "charlie");
    const aliceConversation = await createConversation({
      members: [alice, bob],
      createdBy: alice,
    });
    await createConversation({ members: [bob, charlie], createdBy: bob });

    const response = await app.request("/conversations", {
      headers: { cookie: cookies },
    });
    assert.equal(response.status, 200);
    const { conversations } = await response.json();
    assert.equal(conversations.length, 1);
    assert.equal(conversations[0]._id, aliceConversation.id);
  });

  it("CONV-002: returns an empty array when the user has no conversations", async () => {
    const { cookies } = await registerUser(app.request, "alice");
    const response = await app.request("/conversations", {
      headers: { cookie: cookies },
    });
    assert.equal(response.status, 200);
    assert.deepEqual((await response.json()).conversations, []);
  });

  it("CONV-003 and CONV-004: rejects missing or invalid authentication", async () => {
    assert.equal((await app.request("/conversations")).status, 401);
    const response = await app.request("/conversations", {
      headers: { cookie: "token=invalid-token" },
    });
    assert.equal(response.status, 401);
  });

  it("CONV-005: returns populated public member profiles", async () => {
    const { user: alice, cookies } = await registerUser(app.request, "alice");
    const { user: bob } = await registerUser(app.request, "bob");
    await createConversation({ members: [alice, bob], createdBy: alice });
    const response = await app.request("/conversations", {
      headers: { cookie: cookies },
    });
    assert.equal(response.status, 200);
    const conversation = (await response.json()).conversations[0];
    const bobMember = conversation.members.find(
      (member) => String(member.userId?._id) === bob.id,
    );
    assert.equal(conversation.members.length, 2);
    assert.ok(bobMember);
    assert.equal(bobMember.userId.username, "bob");
    assert.equal("email" in bobMember.userId, false);
    assert.equal("password" in bobMember.userId, false);
  });

  it("CONV-006: returns direct and group conversations", async () => {
    const { user: alice, cookies } = await registerUser(app.request, "alice");
    const { user: bob } = await registerUser(app.request, "bob");
    const { user: charlie } = await registerUser(app.request, "charlie");
    await createConversation({ members: [alice, bob], createdBy: alice });
    await createConversation({
      type: "group",
      name: "Development Team",
      members: [alice, bob, charlie],
      createdBy: alice,
    });
    const response = await app.request("/conversations", {
      headers: { cookie: cookies },
    });
    assert.equal(response.status, 200);
    const { conversations } = await response.json();
    assert.equal(conversations.length, 2);
    assert.ok(
      conversations.some((conversation) => conversation.type === "direct"),
    );
    const group = conversations.find(
      (conversation) => conversation.type === "group",
    );
    assert.equal(group.name, "Development Team");
    assert.equal(group.members.length, 3);
  });

  it("CONV-007: sorts conversations by most recently updated first", async () => {
    const { user: alice, cookies } = await registerUser(app.request, "alice");
    const { user: bob } = await registerUser(app.request, "bob");
    const { user: charlie } = await registerUser(app.request, "charlie");
    const olderConversation = await createConversation({
      members: [alice, bob],
      createdBy: alice,
    });
    const newerConversation = await createConversation({
      members: [alice, charlie],
      createdBy: alice,
    });
    await Conversation.updateOne(
      { _id: olderConversation._id },
      { $set: { updatedAt: new Date("2026-01-01T10:00:00.000Z") } },
      { timestamps: false },
    );
    await Conversation.updateOne(
      { _id: newerConversation._id },
      { $set: { updatedAt: new Date("2026-02-01T10:00:00.000Z") } },
      { timestamps: false },
    );
    const response = await app.request("/conversations", {
      headers: { cookie: cookies },
    });
    const { conversations } = await response.json();
    assert.equal(conversations[0]._id, newerConversation.id);
    assert.equal(conversations[1]._id, olderConversation.id);
  });
});
