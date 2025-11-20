import React, { useState, useEffect, useCallback } from "react";
import { useCart } from "../../context/CartContext";
import { MessageCircle, X, Heart } from "lucide-react";
import {
  addToFavourites,
  removeFavourite,
  getFavourites,
} from "../../services/favouriteService";

const HotelCard = ({ item }) => {
  const { addToCart } = useCart();

  const [reviews, setReviews] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // favourite state
  const [isFav, setIsFav] = useState(false);

  // -----------------------------------------------------
  // READ USER FROM TOKEN
  // -----------------------------------------------------
  const getUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const userData = getUserFromToken();
    if (userData) {
      setIsLoggedIn(true);
    }
  }, []);

  // -----------------------------------------------------
  // SAFE CALLBACK WRAPPING — Fixes missing dependency warning
  // -----------------------------------------------------
  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/reviews/${item._id}`);
      const data = await res.json();
      setReviews(data);
    } catch {}
  }, [item._id]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // -----------------------------------------------------
  // CHECK IF DISH IS ALREADY FAVOURITED
  // -----------------------------------------------------
  useEffect(() => {
    if (!isLoggedIn) return;

    const loadFavs = async () => {
      const favList = await getFavourites();
      const exists = favList.some((f) => f.dishId === item._id);
      setIsFav(exists);
    };

    loadFavs();
  }, [isLoggedIn, item._id]);

  // -----------------------------------------------------
  // TOGGLE FAVOURITE
  // -----------------------------------------------------
  const handleFavouriteToggle = async () => {
    if (!isLoggedIn) return alert("Please login first.");

    try {
      if (isFav) {
        await removeFavourite(item._id);
        setIsFav(false);
      } else {
        await addToFavourites({
          ...item,
          hotelId: item.hotel?._id || item.hotelId,
        });
        setIsFav(true);
      }
    } catch (error) {
      console.log("Favourite error:", error);
    }
  };

  // -----------------------------------------------------
  // FIXED & SAFE ADD TO CART
  // -----------------------------------------------------
  const handleAddToCart = () => {
    if (!isLoggedIn) return alert("Please login to add items to cart!");

    const resolvedHotelId =
      item.hotel?._id ||
      item.hotelId ||
      null;

    if (!resolvedHotelId) {
      alert("❌ Cannot add to cart. Missing Hotel ID.");
      console.error("Missing hotelId in item:", item);
      return;
    }

    addToCart({
      ...item,
      hotelId: resolvedHotelId,
    });

    alert(`${item.name} added to cart!`);
  };

  return (
    <div className="hotel-card bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-all">
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-48 object-cover rounded-xl mb-4"
      />

      <h3 className="font-bold text-xl text-gray-800">{item.name}</h3>
      <p className="text-green-700 font-medium mt-1">₹{item.price}</p>

      <div className="flex gap-3 mt-4">

        {/* ADD TO CART */}
        <button
          onClick={handleAddToCart}
          className="flex-1 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600"
        >
          Add to Cart 🛒
        </button>

        {/* FAVOURITE */}
        <button
          onClick={handleFavouriteToggle}
          className={`flex-1 py-2 border rounded-lg flex justify-center items-center gap-2 ${
            isFav
              ? "bg-red-500 text-white border-red-600"
              : "border-red-500 text-red-600 hover:bg-red-50"
          }`}
        >
          <Heart size={18} fill={isFav ? "white" : "none"} />
          {isFav ? "Added" : "Favourite"}
        </button>

        {/* REVIEWS */}
        <button
          onClick={() => setDialogOpen(true)}
          className="flex-1 py-2 bg-white border border-orange-400 text-orange-600 rounded-lg shadow hover:bg-orange-50 flex justify-center items-center gap-2"
        >
          <MessageCircle size={18} /> Reviews
        </button>
      </div>

      {/* Review Modal */}
      {dialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-11/12 sm:w-96 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setDialogOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold text-orange-600 mb-3">
              {item.name} Reviews
            </h2>

            <div className="max-h-60 overflow-y-auto mb-4">
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-sm">No reviews yet.</p>
              ) : (
                reviews.map((rev, i) => (
                  <div key={i} className="pb-2 border-b mb-2">
                    <p className="font-semibold">{rev.userName}</p>
                    <p className="text-sm text-gray-600">{rev.reviewText}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelCard;
