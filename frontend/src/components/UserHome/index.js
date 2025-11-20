import React, { useEffect, useState } from "react";
import Header from "../Header";
import HotelCard from "../HotelCard";
import { searchItems } from "../../services/searchService";
import "./index.css";

const UserHome = ({ onLogout }) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/hotels");
      if (!response.ok) throw new Error("Failed to fetch hotels");

      const data = await response.json();

      const cleaned = data.map((hotel) => ({
        ...hotel,
        dishitems: hotel.dishitems.map((dish) => ({
          ...dish,
          hotelId: hotel._id,          // ⭐ REQUIRED
          hotelName: hotel.hotelName,  // show use
          hotel: hotel,                // pass full hotel object
          image: dish.image ? dish.image.trim().replace(/^"|"$/g, "") : "",
        })),
      }));

      setHotels(cleaned);
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching hotels:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // SEARCH LOGIC
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchMode(false);
      fetchHotels();
      return;
    }

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        setSearchMode(true);

        const data = await searchItems(searchQuery);

        const combined = [];

        // handle hotels
        data.hotels.forEach((hotel) => {
          combined.push({
            ...hotel,
            dishitems: [],
          });
        });

        // handle dishes
        data.dishes.forEach((dish) => {
          const hotelId = dish.hotel?._id;

          if (!hotelId) return;

          let existing = combined.find((h) => h._id === hotelId);

          if (!existing) {
            existing = {
              _id: dish.hotel._id,
              hotelName: dish.hotel.hotelName,
              dishitems: [],
            };
            combined.push(existing);
          }

          existing.dishitems.push({
            ...dish,
            hotelId: dish.hotel._id,
            hotelName: dish.hotel.hotelName,
            hotel: dish.hotel,
          });
        });

        setHotels(combined);
      } catch (err) {
        console.error("❌ Search error:", err);
        setError("Something went wrong while searching");
      } finally {
        setLoading(false);
      }
    }, 500);

    setTypingTimeout(timeout);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  // SORT LOGIC
  const sortedHotels = [...hotels].map((h) => ({
    ...h,
    dishitems: [...(h.dishitems || [])].sort((a, b) =>
      sortOrder === "asc" ? a.price - b.price : b.price - a.price
    ),
  }));

  return (
    <>
      <Header onLogout={onLogout} />

      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-200 p-6 pt-28">
        <h1 className="text-3xl font-bold text-orange-700 text-center mb-6">
          Welcome to Foodies World 🍴
        </h1>

        {/* SEARCH */}
        <div className="max-w-lg mx-auto mb-6">
          <input
            type="text"
            placeholder="Search for hotels or dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border px-4 py-2 rounded-xl shadow focus:ring-2 focus:ring-orange-300"
          />
        </div>

        {/* SORT */}
        <div className="flex justify-center mb-8">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border px-4 py-2 rounded-lg"
          >
            <option value="asc">Min → Max</option>
            <option value="desc">Max → Min</option>
          </select>
        </div>

        {/* HOTEL + DISHES */}
        {!loading &&
          !error &&
          sortedHotels.map((hotel) => (
            <div
              key={hotel._id}
              className="bg-white p-6 rounded-xl shadow mb-8"
            >
              <h2 className="text-2xl font-bold text-orange-600 mb-4">
                {hotel.hotelName}
              </h2>

              {hotel.dishitems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {hotel.dishitems.map((dish, idx) => (
                    <HotelCard key={idx} item={dish} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No dishes available 🍽️</p>
              )}
            </div>
          ))}
      </div>
    </>
  );
};

export default UserHome;
