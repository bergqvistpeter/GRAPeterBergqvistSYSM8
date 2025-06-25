import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUtensils, FaUser, FaHeart, FaShoppingCart } from "react-icons/fa"; // Ikoner från react-icons
import { useCart } from "../context/CartContext"; // Custom hook för varukorg
import { useAuth } from "../context/AuthContext"; // Custom hook för autentisering

function Navbar() {
  // Hämtar kundvagnens innehåll och användaren från context
  const { cart } = useCart();
  const { user } = useAuth();

  // Räknar totalt antal varor i kundvagnen (summerar alla quantity)
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // React-router hook för att navigera programatiskt
  const navigate = useNavigate();

  // Hanterar klick på Favoriter-ikonen
  // Kollar om användaren är inloggad, annars varnas och navigering stoppas
  const handleFavoritesClick = (e) => {
    e.preventDefault(); // Förhindrar standardlänk-beteende
    if (!user) {
      alert("Du måste vara inloggad för att se dina favoriter.");
      return;
    }
    navigate("/favorites"); // Navigera till favoritsidan
  };

  return (
    <nav style={styles.navbar}>
      {/* Meny-länk */}
      <NavItem
        icon={<FaUtensils className="nav-icon" />}
        label="Menu"
        link="/menu"
      />
      {/* Användarprofil-länk */}
      <NavItem
        icon={<FaUser className="nav-icon" />}
        label="User"
        link="/user"
      />
      {/* Favoriter - specialhanterad pga inloggningskontroll */}
      <div
        onClick={handleFavoritesClick}
        style={styles.navItem}
        role="button"
        tabIndex={0} // Gör div fokusbar och tangentbordsnavigerbar
        onKeyDown={(e) => e.key === "Enter" && handleFavoritesClick(e)} // Stöd för enter-tangent
        aria-label="Favorites"
      >
        <FaHeart className="nav-icon" />
        <p className="nav-label" style={styles.label}>
          Favorites
        </p>
      </div>
      {/* Kundvagn - visar även antal varor i badge */}
      <NavItem
        icon={<FaShoppingCart className="nav-icon" />}
        label="Shopping Cart"
        link="/cart"
        count={cartItemCount}
      />
    </nav>
  );
}

// En generell navlänk-komponent som visar ikon, label och eventuell räknare (count)
function NavItem({ icon, label, link, count }) {
  return (
    <a href={link} style={styles.navItem} aria-label={label}>
      {icon}
      {/* Visar röd badge med antal om count > 0 */}
      {count > 0 && <span style={styles.badge}>{count}</span>}
      <p className="nav-label" style={styles.label}>
        {label}
      </p>
    </a>
  );
}

// CSS-in-JS-stilar för navbar och dess element
const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-around", // Jämnt fördelade nav-item
    alignItems: "center",
    backgroundColor: "#000", // Svart bakgrund
    color: "#fff", // Vit text
    padding: "10px 0",
    position: "fixed", // Fästs längst ner på skärmen
    bottom: 0,
    left: 0,
    width: "100%",
    zIndex: 1000, // Hög z-index så att den ligger ovanpå andra element
    boxSizing: "border-box",
    height: "60px", // Fast höjd för stabilitet
  },
  navItem: {
    textAlign: "center",
    position: "relative", // Behövs för absolut positionering av badge
    textDecoration: "none",
    color: "#fff",
    cursor: "pointer",
  },
  badge: {
    position: "absolute",
    top: -5, // Placering av badge uppe till höger på ikonen
    right: -10,
    backgroundColor: "red",
    color: "white",
    borderRadius: "50%",
    fontSize: 12,
    width: 18,
    height: 18,
    display: "flex", // Centrerar siffran i badgen
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    marginTop: 5,
    fontSize: 12,
  },
};

// Media queries läggs in dynamiskt med vanilla JS eftersom inline styles inte stödjer media queries
if (typeof window !== "undefined") {
  const mediaStyles = `
    @media (max-width: 768px) {
      .nav-label {
        display: none !important; /* Dölj texten på mindre skärmar för att spara plats */
      }
      .nav-icon {
        font-size: 28px !important; /* Större ikoner på mobil */
      }
    }
    @media (min-width: 769px) {
      .nav-icon {
        font-size: 20px !important; /* Mindre ikoner på större skärmar */
      }
    }
  `;
  // Lägger in style-tag i dokumentets head
  const styleTag = document.createElement("style");
  styleTag.innerHTML = mediaStyles;
  document.head.appendChild(styleTag);
}

export default Navbar;
