import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addUser } from "../api/users";

// Funktion för att kryptera lösenord med SHA-256
const hashPassword = async (password) => {
  const encoder = new TextEncoder(); // Skapa en textkodare
  const data = encoder.encode(password); // Konvertera lösenord till bytes
  const hashBuffer = await crypto.subtle.digest("SHA-256", data); // Skapa hash
  // Konvertera hash till en hex-sträng
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const CreateAccount = () => {
  // State för alla fält i formuläret
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate(); // Hook för att navigera till annan sida

  // Funktion som körs när användaren klickar på "Create Account"
  const handleCreateAccount = async () => {
    // Kontrollera att lösenorden matchar
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return; // Avbryt om lösenorden inte stämmer överens
    }

    try {
      // Kryptera lösenordet
      const hashedPassword = await hashPassword(password);

      // Skapa ett objekt med all användardata
      const newUser = {
        name,
        address,
        postalCode,
        city,
        email,
        password: hashedPassword, // Skicka hashat lösenord
      };

      // Skicka data till servern för att skapa användaren
      const createdUser = await addUser(newUser);

      if (createdUser) {
        alert("Account created successfully!"); // Meddelande om framgång
        navigate("/user"); // Skicka användaren till användarsidan
      }
    } catch (err) {
      console.error(err);
      alert("Unable to create account."); // Felmeddelande vid problem
    }
  };

  // Enkla stilinställningar
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px",
      marginTop: "150px",
      backgroundColor: "#fff",
      border: "1px solid #ddd",
      borderRadius: "8px",
      maxWidth: "500px",
      margin: "150px auto",
    },
    title: {
      marginBottom: "20px",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      marginBottom: "20px",
      width: "100%",
    },
    input: {
      padding: "10px",
      borderRadius: "4px",
      border: "1px solid #ccc",
      width: "100%",
    },
    button: {
      padding: "10px 20px",
      borderRadius: "4px",
      border: "none",
      backgroundColor: "#007bff",
      color: "#fff",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create Account</h2>
      <div style={styles.formGroup}>
        {/* Inputfält för användarens namn */}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)} // Uppdatera state vid ändring
          style={styles.input}
        />
        {/* Inputfält för adress */}
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={styles.input}
        />
        {/* Inputfält för postnummer */}
        <input
          type="text"
          placeholder="Postal Code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          style={styles.input}
        />
        {/* Inputfält för stad */}
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={styles.input}
        />
        {/* Inputfält för e-post */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        {/* Inputfält för lösenord */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        {/* Inputfält för bekräfta lösenord */}
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={styles.input}
        />
        {/* Knapp för att skapa konto */}
        <button onClick={handleCreateAccount} style={styles.button}>
          Create Account
        </button>
      </div>
    </div>
  );
};

export default CreateAccount;
