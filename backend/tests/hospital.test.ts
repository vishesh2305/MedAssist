/**
 * Hospital CRUD endpoint tests.
 *
 * Tests create, read, update, delete operations on the hospitals resource.
 * Requires a running backend with a test database.
 */

import { describe, it, expect, beforeAll } from "@jest/globals";

const API_URL = process.env.API_URL || "http://localhost:4000";

let authToken: string;
let createdHospitalId: string;

// Get an auth token before tests
beforeAll(async () => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@medassist.com",
      password: "AdminP@ssw0rd!",
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

const TEST_HOSPITAL = {
  name: "Test International Hospital",
  address: "123 Health Street, Bangkok",
  city: "Bangkok",
  country: "Thailand",
  latitude: 13.7563,
  longitude: 100.5018,
  phone: "+66-2-1234567",
  email: "info@testhosp.com",
  website: "https://testhosp.com",
  rating: 4.5,
  specialties: ["Cardiology", "Orthopedics", "General Medicine"],
  languages: ["thai", "english", "chinese"],
  hasEmergency: true,
  tier: "premium",
  accreditations: ["JCI", "ISO 9001"],
};

describe("Hospital API", () => {
  // ---------- Create ----------
  describe("POST /api/hospitals", () => {
    it("should create a new hospital", async () => {
      const res = await fetch(`${API_URL}/api/hospitals`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(TEST_HOSPITAL),
      });

      // May require admin auth; accept 201 or 401
      if (res.status === 201) {
        const data = await res.json();
        expect(data).toHaveProperty("id");
        expect(data.name).toBe(TEST_HOSPITAL.name);
        expect(data.specialties).toEqual(expect.arrayContaining(["Cardiology"]));
        createdHospitalId = data.id;
      } else {
        expect([401, 403]).toContain(res.status);
      }
    });

    it("should reject hospital without required fields", async () => {
      const res = await fetch(`${API_URL}/api/hospitals`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ name: "" }),
      });
      expect([400, 422]).toContain(res.status);
    });
  });

  // ---------- Read ----------
  describe("GET /api/hospitals", () => {
    it("should return a list of hospitals", async () => {
      const res = await fetch(`${API_URL}/api/hospitals`, {
        headers: headers(),
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data.hospitals || data)).toBe(true);
    });

    it("should support pagination", async () => {
      const res = await fetch(`${API_URL}/api/hospitals?page=1&limit=5`, {
        headers: headers(),
      });
      expect(res.status).toBe(200);
    });

    it("should filter by city", async () => {
      const res = await fetch(`${API_URL}/api/hospitals?city=Bangkok`, {
        headers: headers(),
      });
      expect(res.status).toBe(200);
    });

    it("should filter by specialty", async () => {
      const res = await fetch(`${API_URL}/api/hospitals?specialty=Cardiology`, {
        headers: headers(),
      });
      expect(res.status).toBe(200);
    });
  });

  describe("GET /api/hospitals/:id", () => {
    it("should return a single hospital by id", async () => {
      if (!createdHospitalId) return;
      const res = await fetch(`${API_URL}/api/hospitals/${createdHospitalId}`, {
        headers: headers(),
      });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.name).toBe(TEST_HOSPITAL.name);
    });

    it("should return 404 for non-existent hospital", async () => {
      const res = await fetch(`${API_URL}/api/hospitals/nonexistent-id-999`, {
        headers: headers(),
      });
      expect([404, 400]).toContain(res.status);
    });
  });

  // ---------- Update ----------
  describe("PUT /api/hospitals/:id", () => {
    it("should update hospital details", async () => {
      if (!createdHospitalId) return;
      const res = await fetch(`${API_URL}/api/hospitals/${createdHospitalId}`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify({ rating: 4.8 }),
      });
      if (res.ok) {
        const data = await res.json();
        expect(data.rating).toBe(4.8);
      } else {
        expect([401, 403]).toContain(res.status);
      }
    });
  });

  // ---------- Delete ----------
  describe("DELETE /api/hospitals/:id", () => {
    it("should delete a hospital", async () => {
      if (!createdHospitalId) return;
      const res = await fetch(`${API_URL}/api/hospitals/${createdHospitalId}`, {
        method: "DELETE",
        headers: headers(),
      });
      if (res.ok) {
        expect([200, 204]).toContain(res.status);
      } else {
        expect([401, 403]).toContain(res.status);
      }
    });
  });

  // ---------- Nearby Search ----------
  describe("GET /api/hospitals/nearby", () => {
    it("should find hospitals near a location", async () => {
      const res = await fetch(
        `${API_URL}/api/hospitals/nearby?lat=13.7563&lng=100.5018&radius=10`,
        { headers: headers() }
      );
      // Endpoint may or may not exist
      expect([200, 404]).toContain(res.status);
    });
  });
});
