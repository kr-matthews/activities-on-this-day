export default function Error({ task, statusCode, message }) {
  return (
    <>
      <h1>Error</h1>
      <div>
        Trying to {task} resulted in {message}.
      </div>
    </>
  );
}
