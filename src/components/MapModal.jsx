import { useEffect } from "react";

import "./mapModal.css";

export default function MapModal({ closeModal }) {
  // disable scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "unset");
  }, []);

  // close on 'Esc' press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.code === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <>
      <section className="modal">Map here</section>

      <div className="overlay" onClick={closeModal} />
    </>
  );
}
