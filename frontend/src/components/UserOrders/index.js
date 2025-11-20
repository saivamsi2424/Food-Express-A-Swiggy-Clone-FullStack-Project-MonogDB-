import React, { useEffect, useState } from "react";
import Header from "../Header";
import { getUserOrders } from "../../services/orderService";

const UserOrders = ({ onLogout }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;

  return (
    <>
      <Header onLogout={onLogout} />
      <div className="p-8 pt-28 min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
        <h1 className="text-3xl font-bold text-orange-700 mb-6 text-center">
          🧾 My Orders
        </h1>
        {orders.length === 0 ? (
          <p className="text-center text-gray-600">No orders yet.</p>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-md p-5 border border-gray-200"
              >
                <p className="font-semibold text-gray-800">
                  Order ID: <span className="text-sm">{order._id}</span>
                </p>
                <p className="text-gray-600">
                  Status:{" "}
                  <span className="font-medium text-orange-600">{order.status}</span>
                </p>
                <ul className="mt-3 space-y-1">
                  {order.items.map((item, i) => (
                    <li key={i} className="text-gray-700">
                      🍽️ {item.name} × {item.quantity} — ₹
                      {item.price * item.quantity}
                    </li>
                  ))}
                </ul>
                <p className="font-bold text-green-700 mt-3">
                  Total: ₹{order.totalAmount}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default UserOrders;
