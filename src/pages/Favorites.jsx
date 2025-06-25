import React, { useEffect, useState } from "react";
import Card from "../components/Card"; // Komponent för att visa varje kurs
import Filter from "../components/Filter"; // Filterkomponent för att filtrera favoriterna
import { fetchCourses } from "../api/courses"; // Funktion för att hämta alla kurser från API
import { useFavorites } from "../context/FavoritesContext"; // Context-hook för att hämta favoriter
import { useWindowWidth } from "../hooks/useWindowWidth"; // Custom hook för att få fönsterbredd

function Favorites() {
  const { favorites } = useFavorites(); // Hämtar favoritlistan från kontexten
  const [courses, setCourses] = useState([]); // Alla kurser från API
  const [filters, setFilters] = useState({
    // State för aktiva filter
    category: [], // Valda kategorier (ex: "mains", "desserts", "drinks")
    vegetarian: false, // Om vegetariska rätter ska visas
    nonAlcoholic: false, // Om alkoholfria drycker ska visas
  });
  const [filteredFavorites, setFilteredFavorites] = useState([]); // Favoriter efter filtrering
  const [loading, setLoading] = useState(true); // Laddningsstatus
  const [error, setError] = useState(null); // Felmeddelande

  const width = useWindowWidth(); // Hämta fönsterbredd från custom hook
  const isMobile = width <= 768; // Mobilvy om fönster ≤ 768px
  const isTablet = width > 768 && width <= 1024; // Tabletvy mellan 769-1024px

  // Effekt för att hämta kurser en gång när komponenten mountas
  useEffect(() => {
    fetchCourses()
      .then((data) => {
        setCourses(data); // Spara kurser i state
        setLoading(false); // Ladda klart
      })
      .catch((err) => {
        setError(err.message); // Spara felmeddelande
        setLoading(false); // Ladda klart trots fel
      });
  }, []);

  // Effekt som körs när filters, courses eller favorites ändras
  useEffect(() => {
    const favoriteCourseIds = favorites.map((fav) => fav.courseId); // Extrahera id:n för favoriter
    const favoriteCourses = courses.filter(
      (course) => favoriteCourseIds.includes(course.id) // Plocka ut kurser som är favoriter
    );

    // Filtrera favoriter enligt aktiva filter
    setFilteredFavorites(
      favoriteCourses.filter((course) => {
        // Filtrera på kategori om några kategorier är valda
        if (
          filters.category.length > 0 &&
          !filters.category.includes(course.category)
        ) {
          return false; // Sortera bort om kursens kategori inte är vald
        }
        // Filtrera vegetariska alternativ om vegetarian är satt
        if (
          filters.vegetarian &&
          (course.category === "mains" || course.category === "desserts") &&
          !course.vegetarian
        ) {
          return false; // Sortera bort om kurs inte är vegetarisk när filter är satt
        }
        // Filtrera alkoholfria drycker om nonAlcoholic är satt
        if (
          filters.nonAlcoholic &&
          course.category === "drinks" &&
          !course.nonAlcoholic
        ) {
          return false; // Sortera bort alkoholhaltiga drycker
        }
        return true; // Visa annars kursen
      })
    );
  }, [filters, courses, favorites]);

  // Funktion för att hantera filterändringar
  const onFilterChange = (filterName, value) => {
    if (filterName === "category") {
      // Om filter är kategori, lägg till eller ta bort kategori i listan
      setFilters((prev) => {
        const isSelected = prev.category.includes(value);
        const newCategories = isSelected
          ? prev.category.filter((c) => c !== value) // Ta bort kategori om vald igen
          : [...prev.category, value]; // Lägg till kategori annars
        return { ...prev, category: newCategories };
      });
    } else {
      // Om annat filter (vegetarian, nonAlcoholic) byt bool-värde
      setFilters((prev) => ({ ...prev, [filterName]: !prev[filterName] }));
    }
  };

  // Funktion för att nollställa alla filter
  const resetFilters = () => {
    setFilters({
      category: [],
      vegetarian: false,
      nonAlcoholic: false,
    });
  };

  // Visa laddningsindikator om data laddas
  if (loading) return <p>Loading favorites...</p>;
  // Visa felmeddelande om något gick fel
  if (error) return <p>An error occurred: {error}</p>;

  // Stilobjekt för inline-styling och responsiv design
  const styles = {
    layout: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row", // Stapla vertikalt på mobil, horisontellt annars
      paddingTop: isMobile ? "90px" : "150px", // Mer padding på desktop
      gap: "20px", // Mellanrum mellan filter och innehåll
    },
    filter: {
      width: isMobile ? "100%" : "150px", // Filter bredd full på mobil, fast bredd annars
    },
    mainContent: {
      flex: 1,
      padding: "20px",
    },
    headerTitle: {
      textAlign: "center",
      fontSize: "24px",
      fontWeight: "bold",
      margin: "0 0 10px 0",
      color: "#333",
    },
    gridContainer: {
      display: "grid",
      gap: "20px",
      // Grid med 1 kolumn på mobil, 3 på tablet och 4 på desktop
      gridTemplateColumns: isMobile
        ? "1fr"
        : isTablet
        ? "repeat(3, minmax(200px, 1fr))"
        : "repeat(4, minmax(200px, 1fr))",
      justifyContent: "center",
    },
    gridContainerMobile: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      alignItems: "center",
    },
  };

  return (
    <div style={styles.layout}>
      {/* Filtersektion */}
      <div style={styles.filter}>
        <Filter
          filters={filters} // Aktuella filter
          onFilterChange={onFilterChange} // Callback vid filterändring
          onReset={resetFilters} // Callback för att nollställa filter
          isMobile={isMobile} // Skicka ner om det är mobilvy (för ev. styling)
        />
      </div>

      {/* Huvudinnehåll */}
      <div style={styles.mainContent}>
        <p style={styles.headerTitle}>Your Favorites</p>

        {/* Grid eller column beroende på mobil eller ej */}
        <div
          style={isMobile ? styles.gridContainerMobile : styles.gridContainer}
        >
          {/* Rendera en Card-komponent per favorit */}
          {filteredFavorites.map((course) => (
            <Card key={course.id} {...course} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Favorites;
