const assert = require("../helpers/assert");
const { startTestApp } = require("../helpers/app");
const registerUser = require("../utils/register");

let app;
const idOf = (user) => String(user._id ?? user.id);

beforeAll(async () => {
  app = await startTestApp();
});
beforeEach(async () => {
  await app.resetDatabase();
});
afterAll(async () => {
  await app.close();
});

describe("GET /users/search", () => {
  it("USER-001: finds usernames case-insensitively", async () => {
    const { cookies } = await registerUser(app.request, "alice");
    const { user: john } = await registerUser(app.request, "johnsmith");
    const response = await app.request("/users/search?q=JOHN", {
      headers: { cookie: cookies },
    });
    assert.equal(response.status, 200);
    assert.ok(
      (await response.json()).users.some((user) => user._id === idOf(john)),
    );
  });

  it("USER-002: excludes the authenticated user", async () => {
    const { user: alice, cookies } = await registerUser(app.request, "alice");
    const response = await app.request(
      `/users/search?q=${encodeURIComponent(alice.username)}`,
      { headers: { cookie: cookies } },
    );
    assert.equal(response.status, 200);
    assert.ok(
      (await response.json()).users.every((user) => user._id !== idOf(alice)),
    );
  });

  it("USER-003: treats regex metacharacters literally", async () => {
    const { cookies } = await registerUser(app.request, "alice");
    await registerUser(app.request, "johnsmith");
    const response = await app.request("/users/search?q=.*", {
      headers: { cookie: cookies },
    });
    assert.equal(response.status, 200);
    assert.deepEqual((await response.json()).users, []);
  });

  it("USER-004: limits results and returns only public fields", async () => {
    const { cookies } = await registerUser(app.request, "alice");
    for (let index = 0; index < 12; index += 1)
      await registerUser(app.request, `john${index}`);
    const response = await app.request("/users/search?q=john", {
      headers: { cookie: cookies },
    });
    assert.equal(response.status, 200);
    const { users } = await response.json();
    assert.equal(users.length, 10);
    for (const user of users) {
      assert.deepEqual(Object.keys(user).sort(), ["_id", "username"]);
      assert.equal("password" in user, false);
      assert.equal("email" in user, false);
    }
  });

  it("USER-006: rejects invalid search queries", async () => {
    const { cookies } = await registerUser(app.request, "alice");
    for (const path of [
      "/users/search",
      "/users/search?q=",
      `/users/search?q=${"a".repeat(51)}`,
    ]) {
      assert.equal(
        (await app.request(path, { headers: { cookie: cookies } })).status,
        400,
        path,
      );
    }
  });

  it("USER-007 and USER-008: rejects missing and invalid authentication", async () => {
    assert.equal((await app.request("/users/search?q=john")).status, 401);
    const response = await app.request("/users/search?q=john", {
      headers: { cookie: "token=invalid-token" },
    });
    assert.equal(response.status, 401);
  });
});
