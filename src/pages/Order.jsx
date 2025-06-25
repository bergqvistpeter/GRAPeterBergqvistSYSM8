import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext"; // Hook för att hantera kundvagn (cart)
import { addOrder, updateCourseOrderCount } from "../api/orders"; // API-funktioner för att skapa order och uppdatera orderantal
import { useNavigate } from "react-router-dom"; // Hook för navigering mellan sidor
import { useAuth } from "../context/AuthContext"; // Hook för autentisering och användardata

function Order() {
  const { cart, clearCart } = useCart(); // Hämtar kundvagn och funktion för att tömma den
  const { user } = useAuth(); // Hämtar inloggad användare (om någon)

  // State för formulärdata (kontaktuppgifter)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    postalCode: "",
    city: "",
    email: "",
  });

  // State för valt betalningsmetod
  const [paymentMethod, setPaymentMethod] = useState("");

  // State som håller reda på om beställningen skickas in (för att t.ex. visa "Processing...")
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate(); // Hook för att navigera programatiskt

  // useEffect som fyller i formuläret med användarens sparade uppgifter när komponenten laddas eller när 'user' ändras
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        address: user.address || "",
        postalCode: user.postalCode || "",
        city: user.city || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // Uppdaterar formulärstate när användaren skriver i ett inputfält
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Uppdaterar valt betalningsmetod när användaren ändrar radio-knapp
  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  // Funktion som körs när användaren klickar på "Finish Order"
  const handleFinishOrder = async () => {
    // Validering: Kontrollera att alla fält är ifyllda och betalningsmetod vald
    if (
      !paymentMethod ||
      Object.values(formData).some((val) => val.trim() === "")
    ) {
      alert("Please fill all fields and select a payment method.");
      return;
    }

    // Kontrollera att kundvagnen inte är tom
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setIsSubmitting(true); // Sätt flagga att beställningen skickas in

    // Skapa objekt med all information för ordern
    const orderPayload = {
      userId: user?.id || null, // Koppla ordern till användar-ID om inloggad
      contactInfo: formData, // Kontaktuppgifter
      paymentMethod, // Betalningsmetod
      items: cart, // Produkter i kundvagnen
      createdAt: new Date().toISOString(), // Tidpunkt för beställningen
    };

    try {
      // Skicka ordern till backend och vänta på svar
      const savedOrder = await addOrder(orderPayload);

      // Uppdatera antal beställningar per kurs/rätt i backend
      for (const item of cart) {
        await updateCourseOrderCount(item.id, item.quantity);
      }

      clearCart(); // Töm kundvagnen efter lyckad beställning

      // Spara senaste order i localStorage som fallback (t.ex. för att visa orderbekräftelse vid reload)
      localStorage.setItem("lastOrder", JSON.stringify(savedOrder));

      // Navigera till orderbekräftelse-sidan och skicka med orderdata via state
      navigate("/order-confirmation", { state: { order: savedOrder } });
    } catch (err) {
      // Visa felmeddelande om något går fel
      alert("Failed to place order: " + err.message);
    } finally {
      setIsSubmitting(false); // Oavsett resultat, sluta visa "Processing..."
    }
  };

  // JSX för formuläret och knappar
  return (
    <div
      style={{
        maxWidth: 600,
        margin: "40px auto",
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 8,
        marginTop: "150px",
      }}
    >
      <h2>Order Details</h2>

      {/* Fält för namn */}
      <label>
        Name:
        <input
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          type="text"
          required
          style={{ width: "98.5%", marginBottom: 10 }}
        />
      </label>

      {/* Fält för adress */}
      <label>
        Address:
        <input
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          type="text"
          required
          style={{ width: "98.5%", marginBottom: 10 }}
        />
      </label>

      {/* Fält för postnummer */}
      <label>
        Postal Code:
        <input
          name="postalCode"
          value={formData.postalCode}
          onChange={handleInputChange}
          type="text"
          required
          style={{ width: "98.5%", marginBottom: 10 }}
        />
      </label>

      {/* Fält för stad */}
      <label>
        City:
        <input
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          type="text"
          required
          style={{ width: "98.5%", marginBottom: 10 }}
        />
      </label>

      {/* Fält för email */}
      <label>
        Email:
        <input
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          type="email"
          required
          style={{ width: "98.5%", marginBottom: 20 }}
        />
      </label>

      {/* Betalningsmetoder */}
      <fieldset style={{ marginBottom: 20 }}>
        <legend>Payment Method</legend>
        <label>
          <input
            type="radio"
            name="payment"
            value="swish"
            checked={paymentMethod === "swish"}
            onChange={handlePaymentChange}
          />{" "}
          Swish
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="payment"
            value="creditcard"
            checked={paymentMethod === "creditcard"}
            onChange={handlePaymentChange}
          />{" "}
          Credit Card
        </label>
      </fieldset>

      {/* Knapp för att skicka beställning */}
      <button
        onClick={handleFinishOrder}
        disabled={isSubmitting} // Inaktivera knapp medan ordern behandlas
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          marginRight: 10,
        }}
      >
        {isSubmitting ? "Processing..." : "Finish Order"}
      </button>

      {/* Knapp för att gå tillbaka till kundvagnen */}
      <button
        onClick={() => navigate("/cart")}
        style={{
          padding: "10px 20px",
          backgroundColor: "#6c757d",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Back to Cart
      </button>
    </div>
  );
}

export default Order;
