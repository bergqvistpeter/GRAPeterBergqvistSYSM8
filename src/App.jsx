import React from "react";
// BrowserRouter används för att hantera routing i webbläsaren, vilket möjliggör navigering utan omladdning
import { BrowserRouter as Router } from "react-router-dom";

// Context Providers används för att ge global state till komponenter i appen
import { CartProvider } from "./context/CartContext"; // Provider som håller koll på kundvagnens innehåll och hantering
import { FavoritesProvider } from "./context/FavoritesContext"; // Provider för att hantera användarens favoriter
import AuthProvider, { useAuth } from "./context/AuthContext"; // Provider för autentisering och användaruppgifter samt hook för att läsa användardata

// UI-komponenter som utgör sidans layout, återanvändbara på flera sidor
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// AppRoutes innehåller alla definierade routes, dvs. vilka komponenter som ska visas på olika URL:er
import AppRoutes from "./routes/AppRoutes";

function App() {
  // App är rotkomponenten som sätter upp router och auth provider runt hela appen
  return (
    // Router möjliggör navigation mellan olika sidor i appen utan att ladda om sidan
    <Router>
      {/* AuthProvider gör så att autentiseringsstatus och användarinformation är tillgänglig i hela appen via context */}
      <AuthProvider>
        {/* Vi bryter ut själva innehållet i en egen komponent för att kunna använda useAuth-hooken */}
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

function AppContent() {
  // Hämtar aktuell användare från AuthContext
  const { user } = useAuth();

  return (
    // CartProvider och FavoritesProvider får användarens id för att kunna hämta rätt data
    <CartProvider userId={user?.id}>
      <FavoritesProvider userId={user?.id}>
        {/* Huvudlayout för appen med flexbox som gör att innehållet fyller hela höjden */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh", // Säkerställer att sidan tar hela höjden på viewporten
            margin: 0,
            padding: 0,
            overflowX: "hidden", // Förhindrar horisontell scroll
          }}
        >
          {/* Sidans header */}
          <Header style={{ width: "100%" }} />
          {/* Main innehållsområde där routes renderas */}
          <main style={{ flex: 1, width: "100%" }}>
            <AppRoutes />
          </main>
          {/* Sidans footer */}
          <Footer style={{ width: "100%" }} />
          {/* Navigationsmeny längst ner på sidan */}
          <Navbar style={{ width: "100%" }} />
        </div>
      </FavoritesProvider>
    </CartProvider>
  );
}

export default App;
