import React from "react";
import { useCart } from "../../context/CartContext";
import Header from "../Header";
import { Trash2 } from "lucide-react";
import { placeOrder } from "../../services/orderService";

const Cart = ({ onLogout }) => {
  const {
    cartItems,
    updateQuantity,
    removeItem,
    clearCart,
    totalAmount,
    // setCartItems,  ❌ removed because unused
  } = useCart();

  const handlePlaceOrder = async () => {
    try {
      if (!cartItems || cartItems.length === 0) {
        alert("Your cart is empty.");
        return;
      }

      const items = cartItems.map((item) => ({
        dishId: item._id,
        name: item.name,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        hotelId:
          item.hotelId ||
          (item.hotel && (item.hotel._id || item.hotelId)) ||
          null,
      }));

      const missingHotel = items.some((it) => !it.hotelId);
      if (missingHotel) {
        const proceed = window.confirm(
          "Some items are missing hotelId (backend expects this). Continue anyway?"
        );
        if (!proceed) return;
      }

      await placeOrder(items, totalAmount); // ❌ removed unused variable `res`

      alert("✅ Order placed successfully!");
      clearCart();
    } catch (err) {
      console.error("Error placing order:", err);
      const serverMsg =
        err?.response?.data?.message || err?.message || "Something went wrong";
      alert("Failed to place order: " + serverMsg);
    }
  };

  const sanitizeImage = (img) => {
    if (!img)
      return "https://via.placeholder.com/80x60";
    try {
      return img.trim().replace(/^"|"$/g, "");
    } catch {
      return img;
    }
  };

  return (
    <>
      <Header onLogout={onLogout} />
      <div className="min-h-screen bg-gradient-to-b from-orange-100 via-orange-200 to-orange-300 p-6 pt-28">
        <h1 className="text-3xl font-bold text-orange-700 mb-6 text-center">
          🛒 Your Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-700 text-lg font-medium mb-4">
              Your cart is empty 🛒
            </p>
            <p className="text-gray-500">
              Add some delicious dishes to get started!
            </p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Cart Items
              </h2>
              <button
                onClick={() => {
                  if (window.confirm("Delete all items from cart?"))
                    clearCart();
                }}
                className="text-red-600 font-semibold hover:underline"
              >
                Delete All
              </button>
            </div>

            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between border-b py-4 gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={sanitizeImage(item.image)}
                    alt={item.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/80x60";
                    }}
                    className="w-20 h-16 rounded-md object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-green-600 font-medium">
                      ₹{item.price}
                    </p>
                    {item.hotelId && (
                      <p className="text-xs text-gray-500">
                        Hotel: {item.hotelId}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      item.quantity > 1 &&
                      updateQuantity(item._id, item.quantity - 1)
                    }
                    className="bg-gray-200 px-3 py-1 rounded-full text-xl"
                  >
                    −
                  </button>
                  <span className="font-semibold text-lg">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item._id, (item.quantity || 0) + 1)
                    }
                    className="bg-gray-200 px-3 py-1 rounded-full text-xl"
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <p className="font-semibold text-gray-700">
                    ₹{(Number(item.price) || 0) * (item.quantity || 0)}
                  </p>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(`Remove ${item.name} from cart?`)
                      )
                        removeItem(item._id);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center mt-6">
              <h3 className="text-xl font-bold text-gray-800">Total:</h3>
              <p className="text-2xl font-bold text-green-700">
                ₹{totalAmount}
              </p>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={cartItems.length === 0}
              className="mt-6 bg-orange-500 text-white w-full py-2 rounded-lg hover:bg-orange-600 transition-all font-semibold disabled:opacity-50"
            >
              🧾 Place Order
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
