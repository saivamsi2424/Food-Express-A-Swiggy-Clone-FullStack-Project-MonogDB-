import api from "./api";

export const searchItems = async (query) => {
  const { data } = await api.get(`/search?query=${encodeURIComponent(query)}`);
  return data;
};
