// Importerar nödvändiga komponenter från react-router-dom för routing
import { Routes, Route } from "react-router-dom";

// Importerar de olika sidorna i appen
import Home from "../pages/Home";
import Menu from "../pages/Menu";
import Cart from "../pages/Cart";
import Order from "../pages/Order";
import OrderConfirmation from "../pages/OrderConfirmation";
import Favorites from "../pages/Favorites";
import User from "../pages/User";
import CreateAccount from "../pages/CreateAccount"; // Kontrollera att denna import är korrekt (filväg och filnamn)

const AppRoutes = () => {
  // Routes-komponenten innehåller alla Route-komponenter som definierar appens olika URL:er och vilken komponent som ska renderas på varje URL
  return (
    <Routes>
      {/* Route för startsidan, renderar Home-komponenten */}
      <Route path="/" element={<Home />} />

      {/* Route för menyn */}
      <Route path="/menu" element={<Menu />} />

      {/* Route för kundvagnen */}
      <Route path="/cart" element={<Cart />} />

      {/* Route för order-sidan, där man gör en beställning */}
      <Route path="/order" element={<Order />} />

      {/* Route för orderbekräftelse-sidan */}
      <Route path="/order-confirmation" element={<OrderConfirmation />} />

      {/* Route för favoriter */}
      <Route path="/favorites" element={<Favorites />} />

      {/* Route för användarsidan (profil, inloggning etc) */}
      <Route path="/user" element={<User />} />

      {/* Route för att skapa nytt konto */}
      <Route path="/create-account" element={<CreateAccount />} />
    </Routes>
  );
};

export default AppRoutes;
