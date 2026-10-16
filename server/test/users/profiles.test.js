const assert = require("../helpers/assert");
const bcrypt = require("bcrypt");
const User = require("../../src/models/User.model.js");
const { startTestApp } = require("../helpers/app");
const registerUser = require("../utils/register");

let app;
const idOf = (user) => String(user._id ?? user.id);

async function seedUsers(usernames) {
  const password = await bcrypt.hash("password123", 4);

  return User.insertMany(
    usernames.map((username) => ({
      username,
      email: `${username}@example.com`,
      password,
    })),
  );
}

beforeAll(async () => {
  app = await startTestApp();
});
beforeEach(async () => {
  await app.resetDatabase();
});
afterAll(async () => {
  await app.close();
});

describe("GET /users", () => {
  it("USER-009 through USER-012: returns public users with authentication", async () => {
    const { user: alice, cookies } = await registerUser(app.request, "alice");
    const [bob] = await seedUsers([
      "bob",
      ...Array.from({ length: 20 }, (_, index) => `member${index}`),
    ]);
    const response = await app.request("/users", {
      headers: { cookie: cookies },
    });
    assert.equal(response.status, 200);
    const { users } = await response.json();
    assert.equal(users.length, 20);
    assert.ok(users.some((user) => user._id === idOf(bob)));
    assert.ok(users.every((user) => user._id !== idOf(alice)));
    for (const user of users) {
      assert.deepEqual(Object.keys(user).sort(), ["_id", "username"]);
      assert.equal("password" in user, false);
      assert.equal("email" in user, false);
    }
    assert.equal((await app.request("/users")).status, 401);
  });
});

describe("GET /users/:id", () => {
  it("USER-013 through USER-015: returns public profiles and validates IDs", async () => {
    const { cookies } = await registerUser(app.request, "alice");
    const { user: bob } = await registerUser(app.request, "bob");
    const response = await app.request(`/users/${idOf(bob)}`, {
      headers: { cookie: cookies },
    });
    assert.equal(response.status, 200);
    const { user } = await response.json();
    assert.equal(user._id, idOf(bob));
    assert.equal("email" in user, false);
    assert.equal(
      (
        await app.request("/users/507f1f77bcf86cd799439011", {
          headers: { cookie: cookies },
        })
      ).status,
      404,
    );
    assert.equal(
      (
        await app.request("/users/not-an-object-id", {
          headers: { cookie: cookies },
        })
      ).status,
      400,
    );
  });
});

describe("PATCH /users/profile and /users/avatar", () => {
  it("USER-016 through USER-023: permits safe self-updates only", async () => {
    const { user: alice, cookies } = await registerUser(app.request, "alice");
    const { user: bob } = await registerUser(app.request, "bob");
    const originalBob = await User.findById(idOf(bob)).lean();
    const profile = await app.request("/users/profile", {
      method: "PATCH",
      headers: { cookie: cookies },
      body: JSON.stringify({
        username: "alice_updated",
        bio: "Building a chat app",
        role: "admin",
        passwordHash: "bad",
      }),
    });
    assert.equal(profile.status, 200);
    const { user } = await profile.json();
    assert.equal(user.username, "alice_updated");
    assert.equal(user.bio, "Building a chat app");
    const emptyProfile = await app.request("/users/profile", {
      method: "PATCH",
      headers: { cookie: cookies },
      body: JSON.stringify({}),
    });
    assert.equal(emptyProfile.status, 400);
    const avatar = await app.request("/users/avatar", {
      method: "PATCH",
      headers: { cookie: cookies },
      body: JSON.stringify({ avatar: "https://example.com/alice.png" }),
    });
    assert.equal(avatar.status, 200);
    assert.equal(
      (await avatar.json()).user.avatar,
      "https://example.com/alice.png",
    );
    const storedBob = await User.findById(idOf(bob)).lean();
    assert.equal(storedBob.avatar, originalBob.avatar);
    const invalidAvatar = await app.request("/users/avatar", {
      method: "PATCH",
      headers: { cookie: cookies },
      body: JSON.stringify({ avatar: "not-a-valid-url" }),
    });
    assert.equal(invalidAvatar.status, 400);
    assert.equal(
      (
        await app.request("/users/profile", {
          method: "PATCH",
          body: JSON.stringify({ bio: "Unauthorized" }),
        })
      ).status,
      401,
    );
    assert.equal(
      (
        await app.request("/users/avatar", {
          method: "PATCH",
          body: JSON.stringify({ avatar: "https://example.com/avatar.png" }),
        })
      ).status,
      401,
    );
    assert.equal((await User.findById(idOf(alice)).lean()).role, undefined);
  });
});
