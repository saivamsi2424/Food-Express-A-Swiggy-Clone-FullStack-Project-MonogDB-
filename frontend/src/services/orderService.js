import api from "./api";

// User places an order
export const placeOrder = async (items, totalAmount) => {
  const { data } = await api.post("/orders", { items, totalAmount });
  return data;
};

// User fetches own orders
export const getUserOrders = async () => {
  const { data } = await api.get("/orders/my-orders");
  return data;
};

// Vendor fetches their orders
export const getVendorOrders = async () => {
  const { data } = await api.get("/orders/vendor-orders");
  return data;
};

// Vendor updates order status
export const updateOrderStatus = async (orderId, status) => {
  const { data } = await api.put(`/orders/${orderId}/status`, { status });
  return data;
};
