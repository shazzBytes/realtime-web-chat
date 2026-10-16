const assert = require("./helpers/assert");
const RefreshSession = require("../src/models/RefreshSession.model.js");
const { startTestApp } = require("./helpers/app");
const { cookieHeader } = require("./helpers/http");

let app;

async function register(username, email) {
  return app.request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password: "password123" }),
  });
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

describe("authentication and refresh sessions", () => {
  it("creates and rotates a refresh session", async () => {
    const registration = await register("refresh-user", "refresh@example.com");
    assert.equal(registration.status, 200);
    const registrationCookies = cookieHeader(registration);
    assert.match(registrationCookies, /token=/);
    assert.match(registrationCookies, /refreshToken=/);
    assert.equal(await RefreshSession.countDocuments(), 1);

    const refresh = await app.request("/auth/refresh", {
      method: "POST",
      headers: { cookie: registrationCookies },
    });
    assert.equal(refresh.status, 200);
    assert.match(cookieHeader(refresh), /refreshToken=/);
    assert.equal(await RefreshSession.countDocuments({ revokedAt: null }), 1);
    assert.equal(
      await RefreshSession.countDocuments({ revokedAt: { $ne: null } }),
      1,
    );

    const reusedRefresh = await app.request("/auth/refresh", {
      method: "POST",
      headers: { cookie: registrationCookies },
    });
    assert.equal(reusedRefresh.status, 401);
  });

  it("creates a refresh session during login", async () => {
    const registration = await register("login-user", "login@example.com");
    assert.equal(registration.status, 200);
    await RefreshSession.deleteMany({});

    const login = await app.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "login@example.com",
        password: "password123",
      }),
    });
    assert.equal(login.status, 200);
    assert.match(cookieHeader(login), /refreshToken=/);
    assert.equal(await RefreshSession.countDocuments(), 1);
  });

  it("revokes the refresh session during logout", async () => {
    const registration = await register("logout-user", "logout@example.com");
    const cookies = cookieHeader(registration);
    const logout = await app.request("/auth/logout", {
      method: "POST",
      headers: { cookie: cookies },
    });
    assert.equal(logout.status, 200);
    assert.match(logout.headers.get("set-cookie"), /token=;/);
    assert.match(logout.headers.get("set-cookie"), /refreshToken=;/);
    assert.equal(await RefreshSession.countDocuments({ revokedAt: null }), 0);

    const refreshAfterLogout = await app.request("/auth/refresh", {
      method: "POST",
      headers: { cookie: cookies },
    });
    assert.equal(refreshAfterLogout.status, 401);
  });
});

describe("AUTH-004: current user", () => {
  it("returns the authenticated user's safe public profile", async () => {
    const registration = await register("profile-user", "profile@example.com");
    const response = await app.request("/auth/me", {
      headers: { cookie: cookieHeader(registration) },
    });
    assert.equal(response.status, 200);
    const { user } = await response.json();
    assert.equal(user.username, "profile-user");
    assert.equal(user.email, "profile@example.com");
    assert.equal("password" in user, false);
  });

  it("rejects missing and invalid authentication", async () => {
    assert.equal((await app.request("/auth/me")).status, 401);
    const response = await app.request("/auth/me", {
      headers: { cookie: "token=invalid-token" },
    });
    assert.equal(response.status, 401);
  });
});

describe("AUTH-005: protected REST access", () => {
  it("rejects missing and invalid authentication", async () => {
    assert.equal((await app.request("/conversations")).status, 401);
    const response = await app.request("/conversations", {
      headers: { cookie: "token=invalid-token" },
    });
    assert.equal(response.status, 401);
  });
});
