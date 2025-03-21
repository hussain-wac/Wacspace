import { useEffect } from "react";

const useFavicon = () => {
  useEffect(() => {
    const favicon = document.getElementById("favicon");
    const updateFavicon = () => {
      const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      favicon.href = isDarkMode ? "/favicon-dark.png" : "/favicon-light.png";
    };

    updateFavicon(); // Set favicon on initial load
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", updateFavicon);

    return () => {
      window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", updateFavicon);
    };
  }, []);
};

export default useFavicon;
