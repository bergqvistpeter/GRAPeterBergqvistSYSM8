import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function OrderConfirmation() {
  const { state } = useLocation(); // Hämtar state som skickats via navigation (t.ex. orderdata)
  const navigate = useNavigate(); // Hook för att navigera programatiskt

  const order = state?.order; // Plockar ut orderobjektet från location state

  // Om order saknas eller ordern inte innehåller några items visas ett felmeddelande
  if (!order || !Array.isArray(order.items) || order.items.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center", marginTop: "150px" }}>
        <h1>No order found</h1>
        <p>It seems you have no items in your order.</p>
        <button
          onClick={() => navigate("/")} // Navigerar tillbaka till startsidan
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            marginTop: "20px",
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Om order finns visas en bekräftelsesida med detaljer om beställningen
  return (
    <div style={{ padding: "20px", textAlign: "center", marginTop: "150px" }}>
      <h1>Thanks for your order!</h1>
      <p>Your order should arrive within 30 minutes.</p>
      <h2>You have ordered:</h2>
      <div>
        {/* Lista alla beställda artiklar med antal, namn och totalpris per artikel */}
        {order.items.map((item) => (
          <div key={item.id} style={{ marginBottom: 8 }}>
            {item.quantity}x {item.name} -{" "}
            {(item.price * item.quantity).toFixed(2)} kr
          </div>
        ))}
      </div>
      <p>Your receipt has been sent to your e-mail.</p>
      <button
        onClick={() => navigate("/")} // Navigerar tillbaka till startsidan
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          marginTop: "20px",
        }}
      >
        Back to Home
      </button>
    </div>
  );
}

export default OrderConfirmation;
