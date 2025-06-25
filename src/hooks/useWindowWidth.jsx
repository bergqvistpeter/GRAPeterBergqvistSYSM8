import { useState, useEffect } from "react";

// Custom React-hook för att hålla koll på fönstrets bredd i realtid
export function useWindowWidth() {
  // Skapar en state-variabel 'width' och sätter initialvärdet till nuvarande fönsterbredd
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Funktion som uppdaterar state med aktuell fönsterbredd
    function handleResize() {
      setWidth(window.innerWidth);
    }

    // Lägger till event listener som lyssnar på 'resize'-eventet i webbläsaren
    window.addEventListener("resize", handleResize);

    // Cleanup-funktion som tar bort event listener när komponenten avmonteras
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Tom dependencies-array betyder att denna effekt bara körs en gång vid mount och cleanup vid unmount

  // Returnerar aktuell bredd på webbläsarfönstret
  return width;
}
