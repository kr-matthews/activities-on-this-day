import "./mapModal.css";

export default function MapModal({ closeModal }) {
  return (
    <>
      <section className={`modal${visible ? "" : " hidden"}`}>Map here</section>

      <div
        className={`overlay${visible ? "" : " hidden"}`}
        onClick={closeModal}
      />
    </>
  );
}
