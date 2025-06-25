import { API_URL } from "../config";

// GET Favoriter för en användare
export const fetchFavorites = async (userId) => {
  const response = await fetch(`${API_URL}/favorites?userId=${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch favorites");
  }
  return await response.json();
};

// POST Lägg till favorit
export const addFavorite = async (userId, courseId) => {
  const response = await fetch(`${API_URL}/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, courseId }),
  });
  if (!response.ok) {
    throw new Error("Failed to add favorite");
  }
  return await response.json();
};

// DELETE Ta bort favorit
export const deleteFavorite = async (favoriteId) => {
  const response = await fetch(`${API_URL}/favorites/${favoriteId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete favorite");
  }
  return await response.json();
};
// DELETE Ta bort alla favoriter för en användare
export const deleteFavoritesByUserId = async (userId) => {
  // Hämta alla favoriter för användaren
  const res = await fetch(`${API_URL}/favorites?userId=${userId}`);
  if (!res.ok) throw new Error("Failed to fetch favorites");

  const favorites = await res.json();

  // Radera varje favorit enskilt
  for (const fav of favorites) {
    const delRes = await fetch(`${API_URL}/favorites/${fav.id}`, {
      method: "DELETE",
    });
    if (!delRes.ok) {
      throw new Error(`Failed to delete favorite with id ${fav.id}`);
    }
  }
};
