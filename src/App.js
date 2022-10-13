import axios from "axios";

import { useEffect, useState } from "react";

const URL = `/.netlify/functions/test`;

export default function App() {
  const [secret, setSecret] = useState("waiting...");

  useEffect(() => {
    async function func() {
      try {
        const result = await axios.get(URL);
        setSecret(result.data.message + "!");
      } catch (e) {
        console.error(e);
        setSecret("fail");
      }
    }

    func();
  }, [URL]);

  return (
    <>
      <h1>Strava On-This-Day - WIP</h1>
      <p>
        The secret in the client is {process.env.REACT_APP_API_CLIENT_SECRET}!
      </p>
      <p>The secret in the server is {secret}</p>
    </>
  );
}
