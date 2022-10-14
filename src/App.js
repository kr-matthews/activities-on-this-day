import { useApiData } from "./useApiData";

export default function App() {
  const apiData = useApiData();

  function myFetch() {
    apiData.getDataFromUrl(process.env.REACT_APP_URL);
  }

  return (
    <>
      <h1>Strava On-This-Day - WIP</h1>

      {apiData.isLoading ? (
        <p>Loading</p>
      ) : apiData.data ? (
        <p>The data is {apiData.data}</p>
      ) : apiData.error ? (
        <p>There was an error: {apiData.error.message}</p>
      ) : (
        <button onClick={myFetch}>Fetch data</button>
      )}
    </>
  );
}
