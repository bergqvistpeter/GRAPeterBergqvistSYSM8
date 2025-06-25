import React, { useState, useEffect, useRef } from "react";

// Filter-komponent som hanterar filtreringslogik och rendering av filtersektioner
function Filter({ filters, onFilterChange, onReset, isMobile }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Hanterar sidopanelens öppna/stängda status
  const categories = ["mains", "desserts", "drinks"]; // Kategorier som användaren kan filtrera efter
  const sidebarRef = useRef(null); // Ref för att referera till sidopanelens DOM-element

  // Effekt för att stänga sidopanelen om användaren klickar utanför den
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Kontrollera om klicket är utanför sidopanelen
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false); // Stäng sidopanelen
      }
    };

    // Lägg till eventlistener om sidopanelen är öppen
    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      // Ta bort eventlistener om sidopanelen är stängd
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Städa upp eventlistener på komponentens nedmontering
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Funktion som renderar innehållet i filtret
  const renderFilterContent = () => (
    <div style={styles.filterContent}>
      {/* Sektion för kategorifilter */}
      <div style={styles.filterSection}>
        <h4>Category</h4>
        {categories.map((category) => (
          <label key={category} style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={filters.category.includes(category)} // Kontrollera om kategorin är vald
              onChange={() => onFilterChange("category", category)} // Hantera kategoriändring
            />
            {category.charAt(0).toUpperCase() + category.slice(1)}{" "}
            {/* Första bokstaven versal */}
          </label>
        ))}
      </div>

      {/* Sektion för andra filter, visas endast om "mains" eller "desserts" är valda */}
      {(filters.category.includes("mains") ||
        filters.category.includes("desserts")) && (
        <div style={styles.filterSection}>
          <h4>Other Filters</h4>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={filters.vegetarian} // Kontrollera om "vegetarian" är valt
              onChange={() => onFilterChange("vegetarian")} // Hantera ändring
            />
            Vegetarian
          </label>
        </div>
      )}

      {/* Sektion för dryckesfilter, visas endast om "drinks" är vald */}
      {filters.category.includes("drinks") && (
        <div style={styles.filterSection}>
          <h4>Drinks Filters</h4>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={filters.nonAlcoholic} // Kontrollera om "No Alcohol" är valt
              onChange={() => onFilterChange("nonAlcoholic")} // Hantera ändring
            />
            No Alcohol
          </label>
        </div>
      )}

      {/* Knapp för att återställa filter */}
      <button style={styles.resetButton} onClick={onReset}>
        Reset Filters
      </button>
    </div>
  );

  return (
    <>
      {/* Mobilvy: rendera sidopanel */}
      {isMobile && (
        <div
          ref={sidebarRef} // Referens för att kontrollera klick utanför
          style={{
            ...styles.sidebar,
            transform: isSidebarOpen ? "translateX(0)" : "translateX(-250px)", // Animering för öppna/stänga
          }}
        >
          {/* Peek-knapp för att öppna/stänga sidopanel */}
          <div
            style={styles.peekButton}
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            {isSidebarOpen ? (
              <span style={styles.closeText}>X</span> // Stäng-ikon
            ) : (
              <span style={styles.verticalText}>Filter</span> // Text när sidopanelen är stängd
            )}
          </div>

          {/* Innehållet i sidopanelen */}
          <div style={styles.sidebarContent}>{renderFilterContent()}</div>
        </div>
      )}

      {/* Desktopvy: visa filter direkt */}
      {!isMobile && renderFilterContent()}
    </>
  );
}

// Stilar för komponenten
const styles = {
  sidebar: {
    position: "fixed",
    top: "138px", // Justera för header
    bottom: "53px", // Justera för navbar
    left: 0, // Placera sidopanelen till vänster
    width: "250px",
    height: "calc(100% - 198px)", // Dynamisk höjd baserad på header/navbar
    backgroundColor: "#fff",
    boxShadow: "2px 0 5px rgba(0,0,0,0.3)", // Skuggeffekt
    transition: "transform 0.3s ease", // Mjuk övergång för öppning/stängning
    zIndex: 1000,
    display: "flex",
    flexDirection: "column",
  },
  peekButton: {
    width: "20px",
    height: "100%",
    backgroundColor: "#FFA07A",
    color: "#fff",
    fontSize: "12px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    position: "absolute",
    right: "-20px",
    top: 0,
    zIndex: 1001,
    borderRadius: "0 5px 5px 0", // Rundning på höger sida
    writingMode: "vertical-rl", // Vertikal text
    textOrientation: "upright",
    fontWeight: "bold",
  },
  closeText: {
    color: "#000",
    fontSize: "18px",
    fontWeight: "bold",
  },
  sidebarContent: {
    flex: 1,
    overflowY: "auto", // Gör sidopanel skrollbar
  },
  filterContent: {
    width: "100%",
  },
  filterSection: {
    marginBottom: "20px", // Avstånd mellan filtersektioner
    padding: "10px",
  },
  checkboxLabel: {
    display: "block",
    margin: "5px 0", // Mellanrum mellan checkboxar
    cursor: "pointer",
  },
  resetButton: {
    padding: "8px 12px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "4px", // Rundade hörn
    cursor: "pointer",
    marginTop: "10px",
    width: "100%", // Full bredd på knapp
    transition: "background-color 0.2s ease", // Effekt vid hover
  },
};

export default Filter;
