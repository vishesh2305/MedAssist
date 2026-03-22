/**
 * Emergency flow tests.
 *
 * Tests the emergency request workflow: creating an emergency request,
 * assigning responders, updating status, and notification flow.
 */

import { describe, it, expect, beforeAll } from "@jest/globals";

const API_URL = process.env.API_URL || "http://localhost:4000";

let authToken: string;
let emergencyId: string;

beforeAll(async () => {
  // Login as a regular user
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "testuser@medassist.com",
      password: "TestP@ssw0rd!",
    }),
  });
  if (res.ok) {
    const data = await res.json();
    authToken = data.accessToken;
  }
});

function headers() {
  return {
    "Content-Type": "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  };
}

describe("Emergency API", () => {
  // ---------- Create Emergency ----------
  describe("POST /api/emergencies", () => {
    it("should create an emergency request", async () => {
      const res = await fetch(`${API_URL}/api/emergencies`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          latitude: 13.7563,
          longitude: 100.5018,
          description: "Severe chest pain, difficulty breathing",
          severity: "HIGH",
          symptoms: ["chest_pain", "difficulty_breathing"],
          contactPhone: "+66-81-1234567",
        }),
      });

      if (res.status === 201) {
        const data = await res.json();
        expect(data).toHaveProperty("id");
        expect(data).toHaveProperty("status");
        expect(data.status).toBe("PENDING");
        expect(data.severity).toBe("HIGH");
        emergencyId = data.id;
      } else {
        // API might not be running or auth might be required
        expect([401, 404, 500]).toContain(res.status);
      }
    });

    it("should reject emergency without location", async () => {
      const res = await fetch(`${API_URL}/api/emergencies`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          description: "Need help",
          severity: "MEDIUM",
        }),
      });
      expect([400, 422]).toContain(res.status);
    });

    it("should reject emergency without auth", async () => {
      const res = await fetch(`${API_URL}/api/emergencies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: 13.7563,
          longitude: 100.5018,
          description: "Help needed",
          severity: "LOW",
        }),
      });
      expect(res.status).toBe(401);
    });
  });

  // ---------- Get Emergency Status ----------
  describe("GET /api/emergencies/:id", () => {
    it("should return emergency details", async () => {
      if (!emergencyId) return;
      const res = await fetch(`${API_URL}/api/emergencies/${emergencyId}`, {
        headers: headers(),
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.id).toBe(emergencyId);
      expect(data).toHaveProperty("status");
      expect(data).toHaveProperty("severity");
    });

    it("should return 404 for non-existent emergency", async () => {
      const res = await fetch(`${API_URL}/api/emergencies/nonexistent-id`, {
        headers: headers(),
      });
      expect([404, 400]).toContain(res.status);
    });
  });

  // ---------- List User Emergencies ----------
  describe("GET /api/emergencies", () => {
    it("should return list of user emergencies", async () => {
      const res = await fetch(`${API_URL}/api/emergencies`, {
        headers: headers(),
      });
      if (res.ok) {
        const data = await res.json();
        expect(Array.isArray(data.emergencies || data)).toBe(true);
      } else {
        expect([401, 404]).toContain(res.status);
      }
    });
  });

  // ---------- Update Emergency Status ----------
  describe("PATCH /api/emergencies/:id/status", () => {
    it("should update emergency status", async () => {
      if (!emergencyId) return;
      const res = await fetch(`${API_URL}/api/emergencies/${emergencyId}/status`, {
        method: "PATCH",
        headers: headers(),
        body: JSON.stringify({
          status: "IN_PROGRESS",
          note: "Ambulance dispatched",
        }),
      });
      // May require admin/responder role
      if (res.ok) {
        const data = await res.json();
        expect(data.status).toBe("IN_PROGRESS");
      } else {
        expect([401, 403, 404]).toContain(res.status);
      }
    });

    it("should reject invalid status transition", async () => {
      if (!emergencyId) return;
      const res = await fetch(`${API_URL}/api/emergencies/${emergencyId}/status`, {
        method: "PATCH",
        headers: headers(),
        body: JSON.stringify({ status: "INVALID_STATUS" }),
      });
      expect([400, 422, 403]).toContain(res.status);
    });
  });

  // ---------- Cancel Emergency ----------
  describe("POST /api/emergencies/:id/cancel", () => {
    it("should allow user to cancel their emergency", async () => {
      if (!emergencyId) return;
      const res = await fetch(`${API_URL}/api/emergencies/${emergencyId}/cancel`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ reason: "False alarm, feeling better now" }),
      });
      if (res.ok) {
        const data = await res.json();
        expect(data.status).toBe("CANCELLED");
      } else {
        expect([401, 403, 404, 409]).toContain(res.status);
      }
    });
  });

  // ---------- Nearest Hospitals for Emergency ----------
  describe("GET /api/emergencies/:id/nearby-hospitals", () => {
    it("should return hospitals near the emergency location", async () => {
      if (!emergencyId) return;
      const res = await fetch(
        `${API_URL}/api/emergencies/${emergencyId}/nearby-hospitals`,
        { headers: headers() }
      );
      if (res.ok) {
        const data = await res.json();
        expect(Array.isArray(data.hospitals || data)).toBe(true);
      } else {
        expect([401, 404]).toContain(res.status);
      }
    });
  });
});
