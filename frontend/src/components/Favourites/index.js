import React, { useEffect, useState } from "react";
import Header from "../Header";
import { getFavourites, removeFavourite } from "../../services/favouriteService";
import { useCart } from "../../context/CartContext";

const Favourites = ({ onLogout }) => {
  const [items, setItems] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    loadFavs();
  }, []);

  const loadFavs = async () => {
    const data = await getFavourites();
    setItems(data);
  };

  const handleRemove = async (dishId) => {
    await removeFavourite(dishId);
    loadFavs();
  };

  return (
    <>
      <Header onLogout={onLogout} />

      <div className="p-8 pt-28 min-h-screen bg-orange-100">
        <h1 className="text-3xl font-bold text-orange-700 mb-6 text-center">
          ❤️ Your Favourites
        </h1>

        {items.length === 0 ? (
          <p className="text-center text-gray-600">No favourites yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((dish) => (
              <div
                key={dish.dishId}
                className="bg-white p-4 rounded-xl shadow-md"
              >
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="h-32 w-full object-cover rounded-lg"
                />
                <h3 className="font-bold mt-2">{dish.name}</h3>
                <p className="text-green-700">₹{dish.price}</p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => addToCart(dish)}
                    className="bg-orange-500 text-white px-3 py-1 rounded-lg"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(dish.dishId)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Favourites;
