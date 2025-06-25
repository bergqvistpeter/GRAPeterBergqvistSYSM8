import React from "react";
import { useCart } from "../context/CartContext"; // Context för att hantera kundvagnen
import { useFavorites } from "../context/FavoritesContext"; // Context för att hantera favoriter

// Card-komponenten representerar en produkt eller maträtt
function Card({ id, image, name, description, price }) {
  // Hämtar funktioner och data från CartContext
  const { cart, addToCart, removeFromCart } = useCart();

  // Hämtar funktioner och data från FavoritesContext
  const { favorites, toggleFavorite } = useFavorites();

  // Kontrollera om produkten finns i kundvagnen
  const cartItem = cart.find((item) => item.id === id);
  const quantity = cartItem ? cartItem.quantity : 0; // Om produkten finns, hämta dess antal

  // Kontrollera om produkten är markerad som favorit
  const isFavorite = favorites.some((fav) => fav.courseId === id);

  // Funktion för att växla favoritstatus
  const handleToggleFavorite = () => {
    toggleFavorite(id);
  };

  // JSX för att rendera komponenten
  return (
    <div style={styles.card}>
      {/* Bild och räknare */}
      <div style={styles.imageWrapper}>
        <img src={image} alt={name} style={styles.image} />

        {/* Räknarfunktioner (öka, minska antal) */}
        <div style={styles.counterContainer}>
          <button
            onClick={() => addToCart({ id, name, price })}
            style={styles.counterButton}
            aria-label={`Lägg till en ${name}`}
          >
            +
          </button>
          <span style={styles.quantity}>{quantity}</span>
          {quantity > 0 && (
            <button
              onClick={() => removeFromCart(id)}
              style={styles.counterButton}
              aria-label={`Minska antal av ${name}`}
            >
              -
            </button>
          )}
        </div>
      </div>

      {/* Produktens namn */}
      <h3 style={styles.name}>{name}</h3>

      {/* Produktens beskrivning */}
      <p style={styles.description}>{description}</p>

      {/* Footer: favoritknapp och pris */}
      <div style={styles.footer}>
        <button
          onClick={handleToggleFavorite}
          style={styles.favoriteButton}
          aria-label="Favorit"
        >
          {isFavorite ? "❤️" : "🤍"}{" "}
          {/* Ikon som ändras baserat på favoritstatus */}
        </button>
        <div style={styles.price}>{price} kr</div>
      </div>
    </div>
  );
}

// Stilar för komponenten
const styles = {
  card: {
    border: "1px solid #ccc", // Ram runt kortet
    borderRadius: 8, // Rundade hörn
    padding: 16, // Inre marginal
    width: 250, // Fast bredd
    height: 420, // Fast höjd
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)", // Skugga
    position: "relative", // För att positionera räknaren
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    display: "flex",
    flexDirection: "column", // Vertikal layout
    justifyContent: "space-between", // Fördelar utrymmet mellan element
  },
  imageWrapper: {
    position: "relative", // För att placera räknaren ovanpå bilden
    width: "100%",
    height: 200,
    overflow: "hidden", // Klipper innehåll utanför boxen
    borderRadius: 8,
  },
  image: {
    width: "100%", // Bildens bredd fyller boxen
    height: "100%",
    objectFit: "cover", // Bilden skalar utan att förvrängas
  },
  counterContainer: {
    display: "flex", // Lägger elementen i en rad
    justifyContent: "center",
    alignItems: "center",
    position: "absolute", // Placerar räknaren längst ner på bilden
    bottom: 8,
    left: "50%",
    transform: "translateX(-50%)", // Centrerar horisontellt
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semitransparent bakgrund
    borderRadius: 8,
    padding: "4px 8px",
  },
  counterButton: {
    backgroundColor: "transparent", // Ingen bakgrundsfärg
    border: "1px solid #ccc", // Tunn ram
    borderRadius: 4,
    width: 32,
    height: 32,
    fontSize: 16,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer", // Byter till pekhand vid hover
  },
  quantity: {
    minWidth: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  name: {
    margin: "12px 0 4px 0", // Marginal ovanför och under
    fontWeight: "bold",
    fontSize: 18,
  },
  description: {
    flexGrow: 1, // Tillåter att beskrivningen växer för att fylla utrymmet
    overflow: "hidden",
    textOverflow: "ellipsis", // Lägg till "..." om texten är för lång
    display: "-webkit-box",
    WebkitLineClamp: 3, // Begränsar till 3 rader
    WebkitBoxOrient: "vertical",
    wordBreak: "break-word", // Bryter ord om de är för långa
    marginBottom: 12,
  },
  footer: {
    display: "flex", // Lägger favoritknappen och priset i rad
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  favoriteButton: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: 24,
    cursor: "pointer",
    userSelect: "none", // Förhindrar att texten markeras
  },
  price: {
    fontWeight: "bold",
    fontSize: 16,
  },
};

export default Card;
