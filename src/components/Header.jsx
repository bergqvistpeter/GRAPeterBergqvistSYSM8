import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header style={styles.header}>
      <Link to="/" style={styles.logoLink}>
        <img
          src="/images/Logo.png"
          alt="Logo"
          style={{ height: isMobile ? 70 : 110 }} // Större logo
        />
      </Link>
      <p
        style={{
          ...styles.text,
          fontSize: isMobile ? "24px" : "44px", // Större text
          marginLeft: "20px",
          marginRight: "20px",
        }}
      >
        Drone Delights - Fast, Reliable and Delicious
      </p>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#000",
    color: "#fff",
    padding: "15px 25px", // Mer padding för luftigare känsla
    width: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 1000,
    boxSizing: "border-box",
    minHeight: "100px", // öka min-höjden
  },
  text: {
    fontWeight: "bold",
    textAlign: "center",
    flexGrow: 1,
    margin: "0 10px",
  },
  logoLink: {
    textDecoration: "none",
  },
};

export default Header;
