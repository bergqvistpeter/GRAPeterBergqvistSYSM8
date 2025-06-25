import { createContext, useState, useContext, useEffect } from "react";

// Skapar ett kontext för att hantera kundvagnen
const CartContext = createContext();

// Provider-komponent som ansvarar för att hantera kundvagnens tillstånd
export const CartProvider = ({ children }) => {
  // State för kundvagnen, initialiseras från localStorage
  const [cart, setCart] = useState(() => {
    // Kontrollera om det finns sparad data i localStorage
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : []; // Återställ eller starta med en tom lista
  });

  // Effekt som synkroniserar kundvagnen till localStorage vid varje uppdatering
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Lägg till en vara i kundvagnen
  const addToCart = (item) => {
    setCart((prev) => {
      // Kontrollera om varan redan finns i kundvagnen
      const existingItem = prev.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        // Om varan redan finns, öka mängden
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
            : cartItem
        );
      } else {
        // Om varan inte finns, lägg till den med en mängd på 1
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  // Ta bort en vara från kundvagnen
  const removeFromCart = (id) => {
    setCart(
      (prev) =>
        prev
          .map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
          ) // Minska mängden om varans ID matchar
          .filter((item) => item.quantity > 0) // Ta bort varor med 0 eller negativ mängd
    );
  };

  // Töm kundvagnen helt
  const clearCart = () => {
    setCart([]); // Återställ kundvagnen till en tom lista
  };

  // Tillhandahåll funktioner och data via kontext
  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook för att enkelt använda CartContext i andra komponenter
export const useCart = () => useContext(CartContext);
