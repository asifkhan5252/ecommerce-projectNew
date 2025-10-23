import { useState, useContext, createContext, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // ✅ localStorage se cart load karo
  const [cart, setCart] = useState(() => {
    try {
      const storedCart = localStorage.getItem("cart");
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error parsing cart from localStorage", error);
      return [];
    }
  });

  // ✅ jab bhi cart update ho, localStorage me save karo
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider value={[cart, setCart]}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
