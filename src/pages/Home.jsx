import React, { useState, useEffect } from "react";
import Card from "../components/Card"; // Komponent för att visa en maträtt
import { fetchCourses } from "../api/courses"; // Funktion för att hämta kurser (rätter) från API

function Home() {
  // State för att lagra de populära rätterna
  const [popularDishes, setPopularDishes] = useState([]);
  // State för att visa laddningsstatus
  const [loading, setLoading] = useState(true);
  // State för att hantera eventuella fel
  const [error, setError] = useState(null);

  // useEffect körs när komponenten mountas (första gången sidan visas)
  useEffect(() => {
    // Asynkron funktion för att hämta och behandla data
    const loadPopularDishes = async () => {
      try {
        // Hämtar alla kurser från API
        const data = await fetchCourses();
        console.log("Fetched courses:", data);

        // Sorterar kurserna i fallande ordning efter orderCount (populäritet)
        const sortedData = data.sort((a, b) => b.orderCount - a.orderCount);

        // Tar bara de 4 populäraste rätterna
        const top4 = sortedData.slice(0, 4);

        console.log("Top 4 popular dishes:", top4);
        // Sparar de 4 populäraste rätterna i state
        setPopularDishes(top4);
        // Sätter loading till false eftersom data är hämtat
        setLoading(false);
      } catch (err) {
        // Om det blir fel sparas felmeddelandet
        setError(err.message);
        setLoading(false);
      }
    };

    loadPopularDishes(); // Kör funktionen för att ladda data
  }, []); // [] gör att effekten bara körs en gång

  // Visa laddningsmeddelande medan data hämtas
  if (loading) return <p>Loading popular dishes...</p>;
  // Visa felmeddelande om något gått fel
  if (error) return <p>An error occurred: {error}</p>;

  // När data är hämtad och klar visas rätterna i en grid
  return (
    <div style={styles.container}>
      <p style={styles.headerTitle}>Popular Dishes</p>
      <div style={styles.gridContainer}>
        {/* Loopar igenom de populära rätterna och visar varje som ett Card */}
        {popularDishes.map((dish) => (
          <Card key={dish.id} {...dish} />
        ))}
      </div>
    </div>
  );
}

// Stilar för layouten
const styles = {
  container: {
    paddingTop: "150px",
    marginBottom: "50px",
  },
  headerTitle: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0 0 10px 0",
    paddingBottom: "10px",
    color: "#333",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", // Anpassar kolumner beroende på skärmstorlek
    gap: "20px",
    padding: "0 20px",
    boxSizing: "border-box",
    marginTop: "0",
    justifyItems: "center",
    alignContent: "start",
    minHeight: "auto", // Minsta höjd för att fylla skärmen minus lite utrymme
  },
};

export default Home;
