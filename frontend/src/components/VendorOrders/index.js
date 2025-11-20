import React, { useEffect, useState } from "react";
import VendorHeader from "../VendorHeader";

const VendorOrders = ({ onLogout }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch vendor orders
  useEffect(() => {
    const fetchVendorOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/orders/vendor-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) setOrders(data);
        else setError(data.message || "Failed to fetch vendor orders");
      } catch (err) {
        console.error("Error fetching vendor orders:", err);
        setError("Something went wrong while fetching vendor orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchVendorOrders();
  }, []);

  // 🔁 Update order status
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: newStatus } : o
          )
        );
        alert("✅ Order status updated successfully!");
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Server error while updating order status");
    }
  };

  return (
    <>
      <VendorHeader onLogout={onLogout} />

      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-orange-100 to-orange-200 p-6 pt-28">
        <h1 className="text-3xl font-bold text-orange-700 mb-6 text-center">
          🧾 Vendor Orders Dashboard
        </h1>

        {loading ? (
          <p className="text-center text-gray-600 font-medium">Loading orders...</p>
        ) : error ? (
          <p className="text-center text-red-500 font-medium">{error}</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-600 font-medium">
            No orders received yet 🍽️
          </p>
        ) : (
          <div className="max-w-5xl mx-auto space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-lg p-6 border border-orange-200"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-semibold text-gray-800">
                      Order ID:{" "}
                      <span className="text-orange-600 font-bold">{order._id}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Date: {new Date(order.createdAt).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Preparing"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {order.status}
                    </span>

                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-orange-400"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-700">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <p className="text-gray-500 text-sm">
                    Ordered by: <span className="font-semibold">{order.userId?.name || "Unknown User"}</span>
                  </p>
                  <p className="text-green-700 font-bold text-lg">
                    Total: ₹{order.totalAmount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default VendorOrders;
