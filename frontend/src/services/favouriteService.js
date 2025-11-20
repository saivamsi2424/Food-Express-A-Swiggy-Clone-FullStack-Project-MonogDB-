import api from "./api";

// GET all favourite dishes
export const getFavourites = async () => {
  const { data } = await api.get("/favourites");
  return data; // returns array
};

// ADD dish to favourites
export const addToFavourites = async (dish) => {
  const { data } = await api.post("/favourites/add", { dish });
  return data;
};

// REMOVE dish from favourites
export const removeFavourite = async (dishId) => {
  const { data } = await api.delete(`/favourites/remove/${dishId}`);
  return data;
};
