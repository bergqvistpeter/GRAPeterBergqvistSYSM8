import React from "react";

function Footer() {
  return (
    <footer style={styles.footer}>
      <div className="footerContainer" style={styles.footerContainer}>
        {/* Vänster kolumn: Kontaktuppgifter */}
        <div className="footerColumn" style={styles.footerColumn}>
          <h4 style={styles.columnHeader}>Contact</h4>
          <p>Name: Drone Delights</p>
          <p>Address: Kulladalsgatan 1, 215 64 Malmö</p>
          <p>Phone: 040-444000</p>
          <p>E-mail: info@dronedelights.com</p>
        </div>

        {/* Mitten kolumn: Öppettider */}
        <div className="footerColumn" style={styles.footerColumn}>
          <h4 style={styles.columnHeader}>Opening hours</h4>
          <p>Monday-Friday: 11:00 - 21:00</p>
          <p>Saturday: 10:00 - 23:00</p>
          <p>Sunday: 12:00 - 22:00</p>
        </div>

        {/* Höger kolumn: Information */}
        <div className="footerColumn" style={styles.footerColumn}>
          <h4 style={styles.columnHeader}>Information</h4>
          <p>
            <a href="#about" style={styles.link}>
              About
            </a>
          </p>
          <p>
            <a href="#jobs" style={styles.link}>
              Work with us
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: "#343a40",
    color: "white",
    padding: "20px 10px",
    borderTop: "2px solid #495057",
    marginBottom: "60px",
    width: "100vw",
    boxSizing: "border-box",
  },
  footerContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    margin: "0 auto",
    maxWidth: "1280px",
    width: "100%",
    boxSizing: "border-box",
  },
  footerColumn: {
    flex: 1,
    padding: "0 10px",
    textAlign: "center",
    marginBottom: "20px",
  },
  columnHeader: {
    fontSize: "18px",
    marginBottom: "10px",
  },
  link: {
    fontSize: "14px",
    color: "#cfcfcf",
    textDecoration: "none",
  },
};

// Media Query för responsivitet
if (typeof window !== "undefined") {
  const mediaStyles = document.createElement("style");
  mediaStyles.innerHTML = `
    @media (max-width: 768px) {
      .footerContainer {
        flex-direction: column;
        text-align: center;
      }
      .footerColumn {
        width: 100%;
      }
    }
  `;
  document.head.appendChild(mediaStyles);
}

export default Footer;
