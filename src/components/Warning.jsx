export default function Warning({ label, sentence, children }) {
  //// return ////
  return (
    <div
      className="rectangle"
      style={{
        color: "red",
        backgroundColor: "yellow",
        border: "solid red",
      }}
    >
      <b>{label}</b>: {sentence}
      {children}
    </div>
  );
}
