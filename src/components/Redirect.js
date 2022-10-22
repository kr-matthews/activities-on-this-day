import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Loading from "./Loading";
import Error from "./Error";

import { useApiData } from "../hooks/useApiData";

// ! handle 'error=access_denied' in url

export default function Redirect({ setRefreshToken }) {
  const params = useSearchParams();
  const code = params[0].get("code");
  const { data, isLoading, error, getDataFromUrl } = useApiData();
  const navigate = useNavigate();

  useEffect(() => {
    if (code) {
      console.debug("getting data");
      getDataFromUrl(`/.netlify/functions/auth?code=${code}`);
    }
  }, [code, getDataFromUrl]);

  useEffect(() => {
    if (data) {
      console.debug("got data");
      setRefreshToken(data);
      navigate("/", { replace: true });
    }
  }, [data, navigate, setRefreshToken]);

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
          <button onClick={() => navigate("/authenticate")}>Restart</button>
        </>
      )}
    </>
  );
}
