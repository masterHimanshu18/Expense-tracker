import api from "../lib/api";

export const fetchHabits = async (token: string) => {
  const response = await api.get("/habits", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createHabit = async (habitData: any, token: string) => {
  const response = await api.post("/habits", habitData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateHabit = async (id: string, habitData: any, token: string) => {
  const response = await api.put(`/habits/${id}`, habitData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteHabit = async (id: string, token: string) => {
  const response = await api.delete(`/habits/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
