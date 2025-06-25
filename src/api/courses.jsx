import { API_URL } from "../config";

// Funktion för att hämta alla kurser från API:et
export const fetchCourses = async () => {
  const response = await fetch(`${API_URL}/courses`);
  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }
  return await response.json();
};
// Funktion för att uppdatera en kurs baserat på dess ID och nya data
export const updateCourse = async (id, updatedData) => {
  const response = await fetch(`${API_URL}/courses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) {
    throw new Error("Failed to update course");
  }
  return await response.json();
};
// Funktion för att hämta filtrerade kurser baserat på nyckel och värde
export const fetchFilteredCourses = async (filterKey, filterValue) => {
  const response = await fetch(
    `${API_URL}/courses?${filterKey}=${filterValue}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch filtered courses");
  }
  return await response.json();
};
