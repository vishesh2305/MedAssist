/**
 * Auth endpoint tests - signup, login, token refresh.
 *
 * These tests assume an Express/Fastify backend running on the configured
 * test port with a test database.  They exercise the HTTP layer with
 * supertest (or plain fetch) and validate response shapes and status codes.
 */

import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";

const API_URL = process.env.API_URL || "http://localhost:4000";

// Helpers
async function post(path: string, body: Record<string, unknown>) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

const TEST_USER = {
  email: `test_${Date.now()}@medassist-test.com`,
  password: "SecureP@ssw0rd!",
  name: "Test User",
};

let accessToken: string;
let refreshToken: string;

describe("Auth API", () => {
  // ---------- Signup ----------
  describe("POST /api/auth/signup", () => {
    it("should create a new user and return tokens", async () => {
      const { status, data } = await post("/api/auth/signup", TEST_USER);
      expect(status).toBe(201);
      expect(data).toHaveProperty("accessToken");
      expect(data).toHaveProperty("refreshToken");
      expect(data).toHaveProperty("user");
      expect(data.user.email).toBe(TEST_USER.email);
      expect(data.user).not.toHaveProperty("password");
      accessToken = data.accessToken;
      refreshToken = data.refreshToken;
    });

    it("should reject duplicate email", async () => {
      const { status } = await post("/api/auth/signup", TEST_USER);
      expect(status).toBe(409);
    });

    it("should reject weak password", async () => {
      const { status } = await post("/api/auth/signup", {
        email: "weak@test.com",
        password: "123",
        name: "Weak",
      });
      expect([400, 422]).toContain(status);
    });

    it("should reject invalid email format", async () => {
      const { status } = await post("/api/auth/signup", {
        email: "not-an-email",
        password: "SecureP@ssw0rd!",
        name: "Bad Email",
      });
      expect([400, 422]).toContain(status);
    });
  });

  // ---------- Login ----------
  describe("POST /api/auth/login", () => {
    it("should login with correct credentials", async () => {
      const { status, data } = await post("/api/auth/login", {
        email: TEST_USER.email,
        password: TEST_USER.password,
      });
      expect(status).toBe(200);
      expect(data).toHaveProperty("accessToken");
      expect(data).toHaveProperty("refreshToken");
      accessToken = data.accessToken;
      refreshToken = data.refreshToken;
    });

    it("should reject wrong password", async () => {
      const { status } = await post("/api/auth/login", {
        email: TEST_USER.email,
        password: "WrongPassword!",
      });
      expect(status).toBe(401);
    });

    it("should reject non-existent user", async () => {
      const { status } = await post("/api/auth/login", {
        email: "nobody@nowhere.com",
        password: "irrelevant",
      });
      expect([401, 404]).toContain(status);
    });
  });

  // ---------- Token Refresh ----------
  describe("POST /api/auth/refresh", () => {
    it("should return new access token with valid refresh token", async () => {
      const { status, data } = await post("/api/auth/refresh", {
        refreshToken,
      });
      expect(status).toBe(200);
      expect(data).toHaveProperty("accessToken");
      expect(typeof data.accessToken).toBe("string");
    });

    it("should reject invalid refresh token", async () => {
      const { status } = await post("/api/auth/refresh", {
        refreshToken: "invalid-token-value",
      });
      expect([401, 403]).toContain(status);
    });
  });

  // ---------- Protected Route ----------
  describe("GET /api/auth/me", () => {
    it("should return user profile with valid token", async () => {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toHaveProperty("email", TEST_USER.email);
    });

    it("should reject request without token", async () => {
      const res = await fetch(`${API_URL}/api/auth/me`);
      expect(res.status).toBe(401);
    });
  });
});
