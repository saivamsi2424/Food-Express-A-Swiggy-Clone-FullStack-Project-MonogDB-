import React, { useEffect, useState } from "react";
import VendorHeader from "../VendorHeader";

const VendorHome = ({ onLogout }) => {
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState("");
  const [newHotel, setNewHotel] = useState({ hotelName: "" });
  const [newDish, setNewDish] = useState({});
  const [showDishForm, setShowDishForm] = useState(null);

  // 🆕 Edit dish modal state
  const [editingDish, setEditingDish] = useState(null);
  const [editData, setEditData] = useState({ name: "", image: "", price: "" });

  // 🔹 Fetch vendor’s hotels
  useEffect(() => {
    const fetchMyHotels = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/hotels/my-hotels", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) setHotels(data);
        else setError(data.message || "Failed to fetch your hotels.");
      } catch (err) {
        console.error("Error fetching vendor hotels:", err);
        setError("Something went wrong while fetching your hotels.");
      }
    };

    fetchMyHotels();
  }, []);

  // 🔹 Add new hotel
  const handleAddHotel = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/hotels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newHotel),
      });

      const data = await res.json();

      if (res.ok) {
        setHotels([...hotels, data.hotel]);
        setNewHotel({ hotelName: "" });
        alert("Hotel added successfully!");
      } else {
        setError(data.message || "Failed to add hotel");
      }
    } catch (err) {
      console.error("Error adding hotel:", err);
      setError("Something went wrong while adding hotel.");
    }
  };

  // 🔹 Add new dish
  const handleAddDish = async (hotelName, e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/hotels/${hotelName}/dishitems`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newDish),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setHotels((prev) =>
          prev.map((h) =>
            h.hotelName === hotelName
              ? { ...h, dishitems: [...h.dishitems, ...data.hotel.dishitems] }
              : h
          )
        );
        setNewDish({});
        alert("Dish added successfully!");
      } else {
        setError(data.message || "Failed to add dish");
      }
    } catch (err) {
      console.error("Error adding dish:", err);
      setError("Something went wrong while adding dish.");
    }
  };

  // 🔹 Update dish availability
  const handleAvailabilityChange = async (hotelId, dishId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/hotels/${hotelId}/dishitems/${dishId}/availability`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ availability: newStatus }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setHotels((prev) =>
          prev.map((hotel) =>
            hotel._id === hotelId
              ? {
                  ...hotel,
                  dishitems: hotel.dishitems.map((dish) =>
                    dish._id === dishId
                      ? { ...dish, availability: newStatus }
                      : dish
                  ),
                }
              : hotel
          )
        );
      } else {
        alert(data.message || "Failed to update availability");
      }
    } catch (error) {
      console.error("Error updating availability:", error);
      alert("Something went wrong while updating availability.");
    }
  };

  // ✏️ Edit dish handler (open modal)
  const handleEditDish = (hotelId, dish) => {
    setEditingDish({ hotelId, dishId: dish._id });
    setEditData({
      name: dish.name,
      image: dish.image,
      price: dish.price,
    });
  };

  // 💾 Save updated dish
  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      const { hotelId, dishId } = editingDish;

      const res = await fetch(
        `http://localhost:5000/api/hotels/${hotelId}/dishitems/${dishId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setHotels((prev) =>
          prev.map((hotel) =>
            hotel._id === hotelId
              ? {
                  ...hotel,
                  dishitems: hotel.dishitems.map((dish) =>
                    dish._id === dishId ? { ...dish, ...editData } : dish
                  ),
                }
              : hotel
          )
        );
        setEditingDish(null);
        alert("Dish updated successfully!");
      } else {
        alert(data.message || "Failed to update dish");
      }
    } catch (error) {
      console.error("Error saving edit:", error);
      alert("Something went wrong while updating dish.");
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      <VendorHeader onLogout={onLogout} />

      <h1 className="text-3xl font-bold text-orange-600 mb-6 text-center">
        🍽️ Vendor Dashboard
      </h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Add Hotel Form */}
      <form
        onSubmit={handleAddHotel}
        className="bg-white p-4 rounded-xl shadow-md mb-8 max-w-md mx-auto"
      >
        <h2 className="text-xl font-semibold mb-3 text-center text-gray-800">
          Add New Hotel
        </h2>
        <input
          type="text"
          placeholder="Hotel Name"
          value={newHotel.hotelName}
          onChange={(e) =>
            setNewHotel({ ...newHotel, hotelName: e.target.value })
          }
          className="w-full border rounded-lg px-3 py-2 mb-3"
          required
        />
        <button
          type="submit"
          className="bg-orange-500 text-white w-full py-2 rounded-lg hover:bg-orange-600 transition-all"
        >
          ➕ Add Hotel
        </button>
      </form>

      {/* Display Hotels and Dishes */}
      {hotels.length === 0 && !error && (
        <p className="text-center text-gray-600">
          You haven’t added any hotels yet.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <div
            key={hotel._id}
            className="bg-white rounded-xl shadow-lg p-4 border border-gray-200"
          >
            <h2 className="text-xl font-semibold mt-3 text-orange-600">
              {hotel.hotelName}
            </h2>

            <button
              onClick={() =>
                setShowDishForm(
                  showDishForm === hotel.hotelName ? null : hotel.hotelName
                )
              }
              className="mt-3 bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 text-sm"
            >
              🍛 {showDishForm === hotel.hotelName ? "Cancel" : "Add Dish"}
            </button>

            {/* Add Dish Form */}
            {showDishForm === hotel.hotelName && (
              <form
                onSubmit={(e) => handleAddDish(hotel.hotelName, e)}
                className="mt-3 border-t pt-3"
              >
                <input
                  type="text"
                  placeholder="Dish Name"
                  value={newDish.name || ""}
                  onChange={(e) =>
                    setNewDish({ ...newDish, name: e.target.value })
                  }
                  className="w-full border rounded-lg px-2 py-1 mb-2 text-sm"
                  required
                />
                <input
                  type="text"
                  placeholder="Dish Image URL"
                  value={newDish.image || ""}
                  onChange={(e) =>
                    setNewDish({ ...newDish, image: e.target.value })
                  }
                  className="w-full border rounded-lg px-2 py-1 mb-2 text-sm"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newDish.price || ""}
                  onChange={(e) =>
                    setNewDish({ ...newDish, price: e.target.value })
                  }
                  className="w-full border rounded-lg px-2 py-1 mb-2 text-sm"
                  required
                />
                <button
                  type="submit"
                  className="bg-orange-500 text-white w-full py-1 rounded-lg hover:bg-orange-600 text-sm"
                >
                  Add Dish
                </button>
              </form>
            )}

            {/* Dishes */}
            <h3 className="font-semibold text-gray-800 mt-3">Dishes:</h3>
            {hotel.dishitems?.length === 0 ? (
              <p className="text-sm text-gray-500">No dishes added yet.</p>
            ) : (
              hotel.dishitems.map((dish) => (
                <div
                  key={dish._id}
                  className={`flex justify-between items-center border-b py-2 ${
                    dish.availability === "Not Available" ? "opacity-60" : ""
                  }`}
                >
                  <div>
                    <p className="font-medium">{dish.name}</p>
                    <p className="text-sm text-gray-600">₹{dish.price}</p>
                    <p
                      className={`text-sm ${
                        dish.availability === "Available"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {dish.availability}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={dish.availability}
                      onChange={(e) =>
                        handleAvailabilityChange(
                          hotel._id,
                          dish._id,
                          e.target.value
                        )
                      }
                      className="border px-2 py-1 rounded-md text-sm focus:outline-none"
                    >
                      <option value="Available">Available</option>
                      <option value="Not Available">Not Available</option>
                    </select>

                    <button
                      onClick={() => handleEditDish(hotel._id, dish)}
                      className="bg-blue-500 text-white px-2 py-1 rounded-md text-sm hover:bg-blue-600"
                    >
                      ✏️ Edit
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ))}
      </div>

      {/* ✏️ Edit Dish Modal */}
      {editingDish && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Edit Dish Details
            </h2>

            <input
              type="text"
              placeholder="Dish Name"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 mb-3"
            />
            <input
              type="text"
              placeholder="Image URL"
              value={editData.image}
              onChange={(e) =>
                setEditData({ ...editData, image: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 mb-3"
            />
            <input
              type="number"
              placeholder="Price"
              value={editData.price}
              onChange={(e) =>
                setEditData({ ...editData, price: e.target.value })
              }
              className="w-full border rounded-lg px-3 py-2 mb-3"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingDish(null)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorHome;
