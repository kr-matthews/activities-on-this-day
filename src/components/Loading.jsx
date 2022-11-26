import "./loading.css";

export default function Loading({ task }) {
  const title = "Trying to " + task + "...";
  return (
    <div className="loading-container">
      <div className="loading-spinner" title={title}></div>
    </div>
  );
}
