import { API_URL } from "./api";

export const meetingService = {
  createMeeting: async (data) => {
    const res = await fetch(`${API_URL}/meetings/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error);
    return result;
  },

  // ✅ DELETE FIX (username required)
  deleteMeeting: async (meetingId, username) => {
    const res = await fetch(`${API_URL}/meetings/${meetingId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error);
    return result;
  },

  getMeetings: async () => {
    const res = await fetch(`${API_URL}/meetings`);
    const result = await res.json();
    if (!res.ok) throw new Error("Failed to fetch meetings");
    return result;
  },
};
