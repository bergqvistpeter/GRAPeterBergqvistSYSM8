import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext"; // Custom hook för att hantera kundvagn
import { fetchRecentOrders } from "../api/orders"; // Funktion för att hämta användarens senaste beställningar
import { useNavigate } from "react-router-dom"; // Hook för navigation
import { useAuth } from "../context/AuthContext"; // Hook för användarautentisering

function Cart() {
  // Hämtar kundvagnsdata och funktioner för att manipulera kundvagnen
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth(); // Hämtar inloggad användare
  const [recentOrders, setRecentOrders] = useState([]); // Senaste ordrar för aktuell användare
  const [error, setError] = useState(null); // Felhantering vid hämtning av ordrar
  const navigate = useNavigate(); // Navigation till order-sida
  const [isMobile, setIsMobile] = useState(false); // Responsivitet – används för layoutjusteringar

  // Effekt för att lyssna på fönstrets storlek och sätta "isMobile" state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Mobil om skärm <= 768px
    };
    handleResize(); // Kör en gång vid mount
    window.addEventListener("resize", handleResize); // Lägg till event-lyssnare
    return () => window.removeEventListener("resize", handleResize); // Rensa vid unmount
  }, []);

  // Effekt för att hämta senaste ordrar när användare finns
  useEffect(() => {
    if (user && user.id) {
      fetchRecentOrders()
        .then((orders) => {
          // Filtrerar ordrar för aktuell användare
          const userOrders = orders.filter((order) => order.userId === user.id);
          // Sorterar ordrarna efter datum, nyast först
          const sortedOrders = userOrders.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          // Sparar de två senaste ordrarna i state
          setRecentOrders(sortedOrders.slice(0, 2));
        })
        .catch((err) => setError(err.message)); // Sparar eventuellt felmeddelande
    }
  }, [user]);

  // Funktion som körs vid knapptryck "Order" – navigerar till /order med kundvagnens data
  const handlePlaceOrder = () => {
    navigate("/order", { state: { cart } });
  };

  // Funktion för att lägga till alla varor från en tidigare order till kundvagnen
  const handleAddFromOrder = (order) => {
    order.items.forEach((item) => addToCart(item));
  };

  // Beräknar totalpris i kundvagnen
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Beräknar totalpris för en order
  const getOrderTotal = (order) => {
    return order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  // Stilobjekt för komponentens olika delar, använder flexbox och anpassningar för mobil
  const styles = {
    layout: {
      display: "flex",
      flexDirection: "row",
      padding: "20px",
      gap: "20px",
    },
    layoutMobile: {
      flexDirection: "column",
    },
    cartContainer: {
      flex: 2,
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "20px",
      marginTop: "150px", // Lite extra avstånd uppåt
      backgroundColor: "#fff",
    },
    ordersContainer: {
      flex: 1,
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "20px",
      marginTop: isMobile ? "20px" : "150px", // Mindre marginal på mobil
      backgroundColor: "#f9f9f9",
    },
    itemRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "10px",
    },
    controls: {
      display: "flex",
      alignItems: "center",
      gap: "5px",
    },
    priceAndControls: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    button: {
      margin: "5px",
      padding: "5px 10px",
      borderRadius: "4px",
      border: "none",
      cursor: "pointer",
    },
    primaryButton: {
      backgroundColor: "#007bff", // Blå knapp
      color: "#fff",
    },
    dangerButton: {
      backgroundColor: "#dc3545", // Röd knapp för att rensa
      color: "#fff",
    },
    orderBox: {
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "15px",
      marginBottom: "20px",
      backgroundColor: "#fff",
    },
    orderItem: {
      fontSize: "16px",
      marginBottom: "5px",
    },
    orderItemMobile: {
      fontSize: "14px",
      marginBottom: "3px",
    },
    addToCartButton: {
      margin: "5px 0 0 0",
      padding: "8px 12px",
      borderRadius: "6px",
      border: "1px solid #007bff",
      backgroundColor: "#fff",
      color: "#007bff",
      fontWeight: "bold",
      cursor: "pointer",
      display: "inline-block",
    },
    ul: {
      paddingLeft: "20px",
      marginTop: 10,
      marginBottom: 10,
    },
  };

  // Visar felmeddelande vid fetch-fel
  if (error) return <p>Error: {error}</p>;

  return (
    <div
      style={{
        ...styles.layout,
        ...(isMobile && styles.layoutMobile), // Anpassa layout beroende på skärmstorlek
      }}
    >
      {/* Kundvagnssektion */}
      <div style={styles.cartContainer}>
        <h2>Your Cart</h2>
        {/* Loopar igenom varorna i kundvagnen */}
        {cart.map((item) => (
          <div key={item.id} style={styles.itemRow}>
            <span>{item.name}</span>
            <div style={styles.priceAndControls}>
              {/* Visar pris * antal */}
              <span>{(item.price * item.quantity).toFixed(2)} kr</span>
              <div style={styles.controls}>
                {/* Knapp för att ta bort en enhet av varan */}
                <button
                  style={styles.button}
                  onClick={() => removeFromCart(item.id)}
                >
                  -
                </button>
                <span>{item.quantity}</span> {/* Visar antal */}
                {/* Knapp för att lägga till en enhet */}
                <button style={styles.button} onClick={() => addToCart(item)}>
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
        <hr />
        {/* Visar totalpriset */}
        <p>Total: {totalPrice.toFixed(2)} kr</p>
        {/* Knapp för att gå vidare med ordern */}
        <button
          style={{ ...styles.button, ...styles.primaryButton }}
          onClick={handlePlaceOrder}
        >
          Order
        </button>
        {/* Knapp för att tömma kundvagnen */}
        <button
          style={{ ...styles.button, ...styles.dangerButton }}
          onClick={clearCart}
        >
          Clear
        </button>
      </div>

      {/* Sektion för senaste ordrar */}
      <div style={styles.ordersContainer}>
        <h2>Recent Orders</h2>
        {/* Om användaren är inloggad och har ordrar */}
        {user && recentOrders.length > 0 ? (
          recentOrders.map((order) => (
            <div key={order.id} style={styles.orderBox}>
              <p>
                <strong>Order #{order.id}</strong> - Total:{" "}
                {getOrderTotal(order).toFixed(2)} kr
              </p>
              <ul style={styles.ul}>
                {/* Loopar igenom orderns varor */}
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    style={isMobile ? styles.orderItemMobile : styles.orderItem}
                  >
                    {item.name} x {item.quantity} —{" "}
                    {(item.price * item.quantity).toFixed(2)} kr
                  </li>
                ))}
              </ul>
              {/* Knapp för att lägga till dessa varor till kundvagnen */}
              <button
                style={styles.addToCartButton}
                onClick={() => handleAddFromOrder(order)}
              >
                Add to Cart
              </button>
            </div>
          ))
        ) : user ? (
          <p>No recent orders.</p> // Om inloggad men inga ordrar
        ) : (
          <p>Please log in to see your orders.</p> // Om inte inloggad
        )}
      </div>
    </div>
  );
}

export default Cart;
