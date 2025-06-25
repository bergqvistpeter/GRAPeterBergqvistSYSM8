import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";

// Skapar ett kontext för autentisering
export const AuthContext = createContext();

// Custom hook för att enkelt hämta AuthContext i andra komponenter
export const useAuth = () => useContext(AuthContext);

// Definierar en tidsgräns för sessionen (30 minuter i millisekunder)
const SESSION_TIMEOUT = 30 * 60 * 1000;

const AuthProvider = ({ children }) => {
  // Hanterar användarens autentiseringsstatus
  const [user, setUser] = useState(() => {
    // Hämtar användardata från localStorage
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return null;

    // Kontrollera senaste aktivitetens tidpunkt
    const lastActivity = localStorage.getItem("lastActivity");
    if (!lastActivity) return null;

    // Om sessionstiden har gått ut, rensa localStorage
    if (Date.now() - Number(lastActivity) > SESSION_TIMEOUT) {
      localStorage.removeItem("user");
      localStorage.removeItem("lastActivity");
      return null;
    }

    // Om sessionen är aktiv, återställ användaren från lagringen
    return JSON.parse(savedUser);
  });

  // Uppdaterar senaste aktivitetstid i localStorage
  const updateActivity = useCallback(() => {
    if (user) {
      localStorage.setItem("lastActivity", Date.now().toString());
    }
  }, [user]);

  // Logga in användaren och lagra data i localStorage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("lastActivity", Date.now().toString());
  };

  // Logga ut användaren och rensa lagrad data
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("lastActivity");
  };

  // Effekt som övervakar sessionens utgångstid
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      const lastActivity = localStorage.getItem("lastActivity");
      if (!lastActivity) {
        logout(); // Loggar ut om ingen aktivitet är lagrad
        return;
      }

      // Loggar ut om tiden sedan senaste aktivitet överstiger gränsen
      if (Date.now() - Number(lastActivity) > SESSION_TIMEOUT) {
        logout();
      }
    }, 60 * 1000); // Kontrollerar varje minut

    return () => clearInterval(interval); // Rensar intervallet när komponenten avmonteras
  }, [user]);

  // Effekt som spårar användarens aktivitet och förlänger sessionen
  useEffect(() => {
    if (!user) return;

    // Definierar vilka händelser som ska förlänga sessionen
    const events = ["click", "keydown", "mousemove", "scroll"];
    events.forEach((event) => window.addEventListener(event, updateActivity));

    // Rensar händelsehanterare när användaren loggar ut eller komponenten avmonteras
    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, updateActivity)
      );
    };
  }, [user, updateActivity]);

  // Tillhandahåller `user`, `login`, och `logout` till barnkomponenter
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
