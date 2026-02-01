import { API_URL } from "./api";

export const authService = {
  login: async (data) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw result.error || "Login failed";
    }

    // ✅ SAVE TOKEN & USER AFTER LOGIN
    localStorage.setItem("rtcToken", result.token);
    localStorage.setItem("rtcUser", result.username);

    return result;
  },

  register: async (data) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw result.error || "Registration failed";
    }

    return result;
  },

  logout: () => {
    localStorage.removeItem("rtcToken");
    localStorage.removeItem("rtcUser");
  },
};
