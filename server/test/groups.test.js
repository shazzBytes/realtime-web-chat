const { startTestApp } = require("./helpers/app");
const registerUser = require("./utils/register");

const Conversation = require("../src/models/Conversation.model.js");

// Change this if your group router is mounted at another path.
const GROUPS_PATH = "/groups";


describe("Group conversations API", () => {
  let app;
  let request;

  beforeAll(async () => {
    app = await startTestApp();
    request = app.request;
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await app.resetDatabase();
  });

  async function createGroup(creator, memberIds, overrides = {}) {
    return request(GROUPS_PATH, {
      method: "POST",
      headers: {
        Cookie: creator.cookies,
      },
      body: JSON.stringify({
        name: "Project Team",
        memberIds,
        ...overrides,
      }),
    });
  }

  it("GROUP-001: creates a group successfully", async () => {
    const creator = await registerUser(request, "creator1");
    const member = await registerUser(request, "member1");

    const response = await createGroup(creator, [
      member.user._id.toString(),
    ]);

    expect(response.status).toBe(201);

    const body = await response.json();

    expect(body.conversation.type).toBe("group");
    expect(body.conversation.name).toBe("Project Team");
    expect(body.conversation.members).toHaveLength(2);

    const savedConversation = await Conversation.findById(
      body.conversation._id
    );

    expect(savedConversation).not.toBeNull();
    expect(savedConversation.createdBy.toString()).toBe(
      creator.user._id.toString()
    );
  });

  it("GROUP-002: assigns the creator the admin role", async () => {
    const creator = await registerUser(request, "creator2");
    const member = await registerUser(request, "member2");

    const response = await createGroup(creator, [
      member.user._id.toString(),
    ]);

    expect(response.status).toBe(201);

    const body = await response.json();

    const creatorMembership = body.conversation.members.find(
      (entry) =>
        entry.userId.toString() === creator.user._id.toString()
    );

    expect(creatorMembership).toBeDefined();
    expect(creatorMembership.role).toBe("admin");
  });

  it("GROUP-003: assigns ordinary members the member role", async () => {
    const creator = await registerUser(request, "creator3");
    const member = await registerUser(request, "member3");

    const response = await createGroup(creator, [
      member.user._id.toString(),
    ]);

    expect(response.status).toBe(201);

    const body = await response.json();

    const memberMembership = body.conversation.members.find(
      (entry) =>
        entry.userId.toString() === member.user._id.toString()
    );

    expect(memberMembership).toBeDefined();
    expect(memberMembership.role).toBe("member");
  });

  it("GROUP-004: creates a group with an optional description and avatar", async () => {
    const creator = await registerUser(request, "creator4");
    const member = await registerUser(request, "member4");

    const response = await createGroup(
      creator,
      [member.user._id.toString()],
      {
        description: "Project discussion",
        avatar: "https://example.com/group.png",
      }
    );

    expect(response.status).toBe(201);

    const body = await response.json();

    expect(body.conversation.description).toBe(
      "Project discussion"
    );
    expect(body.conversation.avatar).toBe(
      "https://example.com/group.png"
    );
  });

  it("GROUP-005: rejects unauthenticated requests", async () => {
    const response = await request(GROUPS_PATH, {
      method: "POST",
      body: JSON.stringify({
        name: "Project Team",
        memberIds: ["68f123456789012345678901"],
      }),
    });

    expect(response.status).toBe(401);
    expect(await Conversation.countDocuments({})).toBe(0);
  });

  it("GROUP-006: rejects a missing group name", async () => {
    const creator = await registerUser(request, "creator6");
    const member = await registerUser(request, "member6");

    const response = await createGroup(creator, [
      member.user._id.toString(),
    ], {
      name: undefined,
    });

    expect(response.status).toBe(400);
    expect(await Conversation.countDocuments({})).toBe(0);
  });

  it("GROUP-007: rejects an empty member list", async () => {
    const creator = await registerUser(request, "creator7");

    const response = await createGroup(creator, []);

    expect(response.status).toBe(400);
    expect(await Conversation.countDocuments({})).toBe(0);
  });

  it("GROUP-008: rejects duplicate member IDs", async () => {
    const creator = await registerUser(request, "creator8");
    const member = await registerUser(request, "member8");
    const memberId = member.user._id.toString();

    const response = await createGroup(creator, [
      memberId,
      memberId,
    ]);

    expect(response.status).toBe(400);
    expect(await Conversation.countDocuments({})).toBe(0);
  });

  it("GROUP-009: rejects the creator appearing in memberIds", async () => {
    const creator = await registerUser(request, "creator9");
    const member = await registerUser(request, "member9");

    const response = await createGroup(creator, [
      creator.user._id.toString(),
      member.user._id.toString(),
    ]);

    expect(response.status).toBe(400);
    expect(await Conversation.countDocuments({})).toBe(0);
  });

  it("GROUP-010: rejects malformed member IDs", async () => {
    const creator = await registerUser(request, "creator10");

    const response = await createGroup(creator, ["invalid-id"]);

    expect(response.status).toBe(400);
    expect(await Conversation.countDocuments({})).toBe(0);
  });

  it("GROUP-011: rejects nonexistent members", async () => {
    const creator = await registerUser(request, "creator11");

    const response = await createGroup(creator, [
      "68f123456789012345678901",
    ]);

    expect(response.status).toBe(400);
    expect(await Conversation.countDocuments({})).toBe(0);
  });

  it("GROUP-012: rejects a group name exceeding 100 characters", async () => {
    const creator = await registerUser(request, "creator12");
    const member = await registerUser(request, "member12");

    const response = await createGroup(
      creator,
      [member.user._id.toString()],
      { name: "G".repeat(101) }
    );

    expect(response.status).toBe(400);
    expect(await Conversation.countDocuments({})).toBe(0);
  });

  it("GROUP-013: rejects a description exceeding 500 characters", async () => {
    const creator = await registerUser(request, "creator13");
    const member = await registerUser(request, "member13");

    const response = await createGroup(
      creator,
      [member.user._id.toString()],
      { description: "D".repeat(501) }
    );

    expect(response.status).toBe(400);
    expect(await Conversation.countDocuments({})).toBe(0);
  });

  it("GROUP-014: does not trust client-supplied creator or member roles", async () => {
    const creator = await registerUser(request, "creator14");
    const member = await registerUser(request, "member14");

    const response = await createGroup(
      creator,
      [member.user._id.toString()],
      {
        createdBy: member.user._id.toString(),
        members: [
          {
            userId: member.user._id.toString(),
            role: "admin",
          },
        ],
      }
    );

    expect(response.status).toBe(201);

    const body = await response.json();

    expect(body.conversation.createdBy.toString()).toBe(
      creator.user._id.toString()
    );

    const creatorMembership = body.conversation.members.find(
      (entry) =>
        entry.userId.toString() === creator.user._id.toString()
    );

    const memberMembership = body.conversation.members.find(
      (entry) =>
        entry.userId.toString() === member.user._id.toString()
    );

    expect(creatorMembership.role).toBe("admin");
    expect(memberMembership.role).toBe("member");
  });
});
