import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Custom hook för autentisering (login/logout och användarinfo)
import { useNavigate } from "react-router-dom"; // Hook för att navigera mellan sidor
import { deleteUser } from "../api/users"; // Funktion för att radera användare via API
import { deleteOrdersByUserId } from "../api/orders"; // Funktion för att radera ordrar kopplade till användare
import { deleteFavoritesByUserId } from "../api/favorites"; // Funktion för att radera favoriter kopplade till användare

// Funktion som hashar ett lösenord med SHA-256
const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  // Konverterar hash-bufferten till en hex-sträng
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const User = () => {
  // Hämtar nuvarande användare och auth-funktioner från context
  const { user, login, logout } = useAuth();
  // Hook för att programatiskt navigera till andra routes
  const navigate = useNavigate();

  // Lokala state-variabler för edit-läge, login-form, glömt lösenord, samt profilformulär
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [formData, setFormData] = useState({
    name: user?.name || "", // Förifyller formulär med användarinfo om inloggad
    address: user?.address || "",
    postalCode: user?.postalCode || "",
    city: user?.city || "",
    password: "",
    confirmPassword: "",
  });

  // Funktion för att logga in användare
  const handleLogin = async () => {
    try {
      // Hämtar användare med angiven email från API
      const res = await fetch(`http://localhost:3000/users?email=${email}`);
      const users = await res.json();
      const foundUser = users[0];

      if (!foundUser) {
        alert("Incorrect email or password."); // Email finns ej
        return;
      }

      // Hashar det inskrivna lösenordet och jämför med det sparade i databasen
      const hashedInput = await hashPassword(password);
      if (hashedInput === foundUser.password) {
        login(foundUser); // Logga in användaren i context
        alert("Login successful!");
      } else {
        alert("Incorrect email or password."); // Fel lösenord
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong during login."); // Fel vid API-anrop
    }
  };

  // Funktion för att återställa lösenord (glömt lösenord)
  const handleForgotPassword = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/users?email=${forgotEmail}`
      );
      const users = await res.json();
      const foundUser = users[0];

      if (!foundUser) {
        alert("No user found with that email."); // Email finns ej
        return;
      }

      // Genererar ett nytt slumpmässigt lösenord
      const newPass = Math.random().toString(36).slice(-8);
      const hashed = await hashPassword(newPass);

      // Uppdaterar användarens lösenord i databasen
      await fetch(`http://localhost:3000/users/${foundUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...foundUser, password: hashed }),
      });

      // Visar nyckelordet i en alert (skulle i produktion skickas via email)
      alert(
        `An email with the new password has been sent ("New Password: ${newPass}")`
      );
    } catch (err) {
      console.error(err);
      alert("Unable to reset password.");
    }
  };

  // Funktion för att spara ändringar i användarprofil
  const handleSaveChanges = async () => {
    const requiredFields = ["name", "address", "postalCode", "city"];
    // Kolla om några obligatoriska fält saknas
    const missingFields = requiredFields.filter(
      (field) => !formData[field].trim()
    );

    if (missingFields.length > 0) {
      alert(
        `Please fill in the following fields: ${missingFields
          .map((field) => field.charAt(0).toUpperCase() + field.slice(1))
          .join(", ")}.`
      );
      return;
    }

    // Kontrollera att nya lösenordet och bekräftelsen matchar
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const updatedData = { ...formData, email: user.email };
      // Om lösenord har angivits, hashas det
      if (formData.password) {
        updatedData.password = await hashPassword(formData.password);
      }
      delete updatedData.confirmPassword;

      // Uppdatera användardata via API
      await fetch(`http://localhost:3000/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      // Hämta uppdaterad användardata och uppdatera context
      const res = await fetch(`http://localhost:3000/users/${user.id}`);
      const fullUserData = await res.json();

      login(fullUserData);

      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Unable to save changes.");
    }
  };

  // Funktion för att radera användarkonto och kopplade data
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Är du säker på att du vill ta bort ditt konto? Denna åtgärd kan inte ångras."
    );
    if (!confirmed) return;

    try {
      // Radera först ordrar och favoriter kopplade till användaren
      await deleteOrdersByUserId(user.id);
      await deleteFavoritesByUserId(user.id);
      // Radera själva användaren
      const success = await deleteUser(user.id);

      if (success) {
        alert("Your account, all orders, and favorites have been deleted.");
        logout(); // Logga ut användaren
        navigate("/"); // Skicka till startsida
      } else {
        alert("Failed to delete account.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while deleting the account.");
    }
  };

  // Hantera förändringar i profilformuläret
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // CSS-in-JS-stilar
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px",
      backgroundColor: "#fff",
      border: "1px solid #ddd",
      borderRadius: "8px",
      maxWidth: "500px",
      margin: "150px auto 10px auto",
    },
    title: { marginBottom: "20px" },
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
      boxSizing: "border-box",
    },
    button: {
      padding: "10px 20px",
      borderRadius: "4px",
      border: "none",
      cursor: "pointer",
      marginTop: "10px",
      width: "100%",
      boxSizing: "border-box",
    },
    primaryButton: { backgroundColor: "#007bff", color: "#fff" },
    secondaryButton: { backgroundColor: "#6c757d", color: "#fff" },
    deleteButton: {
      backgroundColor: "#dc3545",
      color: "#fff",
      border: "none",
      padding: "10px 20px",
      borderRadius: "4px",
      cursor: "pointer",
      marginTop: "10px",
      width: "100%",
      boxSizing: "border-box",
    },
    userInfo: { textAlign: "center" },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>User Page</h2>

      {user ? ( // Om användaren är inloggad
        <div style={styles.userInfo}>
          {!isEditing ? ( // Visa profilvy
            <>
              <p>
                Logged in as: <strong>{user.email}</strong>
              </p>
              <button
                style={{ ...styles.button, ...styles.primaryButton }}
                onClick={() => setIsEditing(true)} // Gå till edit-läge
              >
                Edit Profile
              </button>
              <button
                style={{ ...styles.button, ...styles.secondaryButton }}
                onClick={() => {
                  logout(); // Logga ut
                  setIsEditing(false);
                }}
              >
                Logout
              </button>
              <button style={styles.deleteButton} onClick={handleDeleteAccount}>
                Delete Account
              </button>
            </>
          ) : (
            // Edit-läge för att redigera profil
            <div style={styles.formGroup}>
              <h3>Edit Profile</h3>
              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder="Name"
                onChange={handleInputChange}
                style={styles.input}
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                placeholder="Address"
                onChange={handleInputChange}
                style={styles.input}
              />
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                placeholder="Postal Code"
                onChange={handleInputChange}
                style={styles.input}
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                placeholder="City"
                onChange={handleInputChange}
                style={styles.input}
              />
              <input
                type="password"
                name="password"
                placeholder="New Password"
                value={formData.password}
                onChange={handleInputChange}
                style={styles.input}
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                style={styles.input}
              />
              <button
                style={{ ...styles.button, ...styles.primaryButton }}
                onClick={handleSaveChanges} // Spara profiländringar
              >
                Save Changes
              </button>
              <button
                style={{ ...styles.button, ...styles.secondaryButton }}
                onClick={() => setIsEditing(false)} // Avbryt redigering
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      ) : (
        // Om användaren inte är inloggad, visa login-form, glömt lösenord och Create account
        <div style={styles.formGroup}>
          <h3>Login</h3>
          <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={handleLogin} // Logga in
          >
            Login
          </button>

          <h3>Forgot Password</h3>
          <input
            type="email"
            value={forgotEmail}
            placeholder="Enter your email"
            onChange={(e) => setForgotEmail(e.target.value)}
            style={styles.input}
          />
          <button
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={handleForgotPassword} // Återställ lösenord
          >
            Reset Password
          </button>

          {/* Skapa konto-knapp som navigerar till annan sida */}
          <button
            style={{
              ...styles.button,
              ...styles.primaryButton,
              marginTop: "20px",
            }}
            onClick={() => navigate("/create-account")}
          >
            Create Account
          </button>
        </div>
      )}
    </div>
  );
};

export default User;
