import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Loading from "../Loading";
import Error from "../Error";

import { useFetchData } from "../../hooks/useFetchData";

// ! handle 'error=access_denied' in url

export default function Redirect({ setRefreshToken }) {
  const params = useSearchParams();
  const code = params[0].get("code");
  const { data, isLoading, error, fetch } = useFetchData();
  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
      console.info("Fetching refresh token.");
      fetch([`/.netlify/functions/get-refresh-token?code=${code}`]);
    }
  }, [code, fetch]);

  useEffect(() => {
    if (data) {
      console.info("Received refresh token.");
      setRefreshToken(data);
      navigate("/", { replace: true });
    }
  }, [data, navigate, setRefreshToken]);

  // !! add no code error case
  // ! descriptive error message/UI, based on 2 possible errors
  // todo: tidy up redirect UI (success case should be removed, it's just confusing)
  return (
    <>
      {isLoading && <Loading task="fetch persistent token" />}
      {data && <div>Success! You should be redirected shortly.</div>}
      {error && (
        <>
          <Error
            task="fetch persistent token"
            statusCode={error.statusCode}
            message={error.message}
          />
          <button onClick={() => navigate("/authenticate")}>Try again</button>
        </>
      )}
    </>
  );
}
