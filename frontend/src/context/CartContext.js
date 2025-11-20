import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // Optional: initialize cart from localStorage so refresh doesn't clear it
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem("foodexpress_cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // keep localStorage in sync (optional but helpful)
  useEffect(() => {
    try {
      localStorage.setItem("foodexpress_cart", JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  // Adds a dish object to cart. Ensures dish has _id and a hotelId if available.
  const addToCart = (dish, quantity = 1) => {
    if (!dish || !dish._id) {
      console.warn("addToCart: invalid dish", dish);
      return;
    }

    // Normalize hotelId onto the dish so cart always carries it
    const normalizedDish = {
      ...dish,
      hotelId:
        dish.hotelId ||
        dish.hotel?._id ||
        dish.hotel?._id ||
        (dish.hotel && dish.hotel._id) ||
        null,
    };

    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === normalizedDish._id);
      if (existing) {
        return prev.map((item) =>
          item._id === normalizedDish._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { ...normalizedDish, quantity }];
      }
    });
  };

  // Update quantity (ensure minimum 1)
  const updateQuantity = (dishId, quantity) => {
    if (!dishId) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === dishId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  // Remove an item
  const removeItem = (dishId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== dishId));
  };

  const clearCart = () => setCartItems([]);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        totalAmount,
        setCartItems, // expose if you want to restore cart after order etc.
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
