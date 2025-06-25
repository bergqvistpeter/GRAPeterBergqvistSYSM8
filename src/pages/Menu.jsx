import React, { useEffect, useState } from "react";
import Card from "../components/Card"; // Komponent som visar en kurs
import Filter from "../components/Filter"; // Komponent för filtrering
import { fetchCourses } from "../api/courses"; // Funktion för att hämta kurser från API
import { useWindowWidth } from "../hooks/useWindowWidth"; // Hook för att läsa fönsterbredd

function Menu() {
  // State för att lagra alla kurser från API
  const [courses, setCourses] = useState([]);

  // State för filterinställningar, som kategorier och booleska filter
  const [filters, setFilters] = useState({
    category: [], // Valda kategorier
    vegetarian: false, // Visa bara vegetariska rätter om true
    nonAlcoholic: false, // Visa bara alkoholfria drycker om true
  });

  // State för kurser som filtrerats baserat på användarens filterval
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Laddningsstatus och felhantering
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hämta bredd på fönstret med hjälp av en custom hook
  const width = useWindowWidth();
  const isMobile = width <= 768; // Definiera mobilvy
  const isTablet = width > 768 && width <= 1024; // Definiera tabletvy

  // Effekt som körs en gång när komponenten mountas för att hämta kurser
  useEffect(() => {
    fetchCourses()
      .then((data) => {
        setCourses(data); // Spara hämtade kurser i state
        setLoading(false); // Ladda klart
      })
      .catch((err) => {
        setError(err.message); // Spara felmeddelande
        setLoading(false); // Ladda klart trots fel
      });
  }, []);

  // Effekt som körs varje gång filter eller kurser ändras
  // Filtrerar kurser baserat på filterinställningar
  useEffect(() => {
    const filtered = courses.filter((course) => {
      // Filtrera på valda kategorier, om några är valda
      if (
        filters.category.length > 0 &&
        !filters.category.includes(course.category)
      ) {
        return false; // Exkludera kurs om kategori ej är vald
      }
      // Filtrera vegetariska rätter (endast "mains" och "desserts" berörs)
      if (
        filters.vegetarian &&
        (course.category === "mains" || course.category === "desserts") &&
        !course.vegetarian
      ) {
        return false; // Exkludera om kursen inte är vegetarisk
      }
      // Filtrera alkoholfria drycker
      if (
        filters.nonAlcoholic &&
        course.category === "drinks" &&
        !course.nonAlcoholic
      ) {
        return false; // Exkludera alkoholhaltiga drycker
      }
      return true; // Visa kurs om inga filter exkluderar den
    });

    setFilteredCourses(filtered); // Uppdatera state med filtrerade kurser
  }, [filters, courses]);

  // Funktion för att hantera när användaren ändrar ett filter
  const onFilterChange = (filterName, value) => {
    if (filterName === "category") {
      // Om filter är kategori, lägg till eller ta bort kategori i listan
      setFilters((prev) => {
        const isSelected = prev.category.includes(value);
        const newCategories = isSelected
          ? prev.category.filter((c) => c !== value) // Ta bort om redan valt
          : [...prev.category, value]; // Lägg till om nytt val
        return { ...prev, category: newCategories };
      });
    } else {
      // För booleska filter (vegetarian, nonAlcoholic) vänd värdet
      setFilters((prev) => ({ ...prev, [filterName]: !prev[filterName] }));
    }
  };

  // Nollställ alla filter till standardvärden
  const resetFilters = () => {
    setFilters({
      category: [],
      vegetarian: false,
      nonAlcoholic: false,
    });
  };

  // Visa laddningsindikator medan data hämtas
  if (loading) return <p>Loading menu...</p>;
  // Visa felmeddelande om något gick fel vid hämtning
  if (error) return <p>An error occurred: {error}</p>;

  // Inline-styling för layout och responsiv design
  const styles = {
    layout: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row", // Stapla vertikalt på mobil, horisontellt annars
      paddingTop: isMobile ? "100px" : "150px", // Padding-top anpassad för skärmstorlek
      gap: "20px", // Mellanrum mellan filter och innehåll
    },
    filter: {
      width: isMobile ? "100%" : "150px", // Filter tar full bredd på mobil, fast bredd annars
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
      // Gridkolumner anpassas efter skärmstorlek
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

  // JSX för komponenten
  return (
    <div style={styles.layout}>
      {/* Filterdel */}
      <div style={styles.filter}>
        <Filter
          filters={filters} // Aktuella filtervärden
          onFilterChange={onFilterChange} // Callback vid ändring av filter
          onReset={resetFilters} // Callback för att nollställa filter
          isMobile={isMobile} // Skicka ner om det är mobilvy för eventuella stiljusteringar i Filter
        />
      </div>

      {/* Huvudinnehåll */}
      <div style={styles.mainContent}>
        <p style={styles.headerTitle}>Menu</p>

        {/* Visar kurser i grid eller kolumn beroende på mobilvy */}
        <div
          style={isMobile ? styles.gridContainerMobile : styles.gridContainer}
        >
          {filteredCourses.map((course) => (
            <Card key={course.id} {...course} /> // Rendera varje kurs som ett Card
          ))}
        </div>
      </div>
    </div>
  );
}

export default Menu;
