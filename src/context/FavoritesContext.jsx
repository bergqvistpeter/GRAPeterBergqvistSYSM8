import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchFavorites, addFavorite, deleteFavorite } from "../api/favorites";

// Skapar ett kontext för att hantera favoriter
const FavoritesContext = createContext();

// Provider-komponent för favoriter
export const FavoritesProvider = ({ children, userId }) => {
  const [favorites, setFavorites] = useState([]);

  // Effekt för att hämta användarens favoriter när userId ändras
  useEffect(() => {
    if (userId) {
      // Hämta favoriter från API för aktuell användare
      fetchFavorites(userId).then(setFavorites).catch(console.error); // Logga fel vid misslyckad hämtning
    } else {
      // Rensa favoriter om ingen användare är inloggad
      setFavorites([]);
    }
  }, [userId]);

  // Funktion för att lägga till/ta bort en favorit
  const toggleFavorite = async (courseId) => {
    if (!userId) {
      // Om användaren inte är inloggad, visa ett meddelande
      alert("Du måste vara inloggad för att spara favoriter.");
      return;
    }

    // Kontrollera om kursen redan är en favorit
    const existingFavorite = favorites.find((fav) => fav.courseId === courseId);
    if (existingFavorite) {
      // Ta bort favoriten om den redan finns
      await deleteFavorite(existingFavorite.id);
      setFavorites((prev) => prev.filter((fav) => fav.courseId !== courseId)); // Uppdatera lokala favoriter
    } else {
      // Lägg till kursen som en ny favorit
      const newFavorite = await addFavorite(userId, courseId);
      setFavorites((prev) => [...prev, newFavorite]); // Uppdatera lokala favoriter
    }
  };

  // Tillhandahåll favoriter och toggle-funktion via kontext
  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook för att enkelt använda FavoritesContext
export const useFavorites = () => useContext(FavoritesContext);
