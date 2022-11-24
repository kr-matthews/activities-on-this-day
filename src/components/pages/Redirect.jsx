import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Loading from "../Loading";
import Error from "../Error";
import RevokeAndClear from "../RevokeAndClear";

import { useFetchData } from "../../hooks/useFetchData";
import strings from "../../data/strings";

export default function Redirect({ setRefreshToken }) {
  const navigate = useNavigate();
  const params = useSearchParams();

  const code = params[0].get("code");

  const scope = params[0].get("scope");
  // good: read,activity:read_all --- bad: read
  const hasCorrectScope = scope && scope.includes("read_all");

  const error = params[0].get("error");
  // bad: access_denied
  const hasPermissionDenied = error && error.includes("denied");

  const { data, isLoading, error: fetchError, fetch } = useFetchData();

  useEffect(() => {
    if (code && hasCorrectScope) {
      console.info("Fetching refresh token.");
      fetch([`/.netlify/functions/get-refresh-token?code=${code}`]);
    }
  }, [code, hasCorrectScope, fetch]);

  useEffect(() => {
    if (data && hasCorrectScope) {
      console.info("Received refresh token; saving it.");
      setRefreshToken(data);
      navigate("/", { replace: true });
    }
  }, [data, hasCorrectScope, navigate, setRefreshToken]);

  return (
    <>
      {hasPermissionDenied && (
        <Error customMessage={strings.errors.permissionDenied} />
      )}

      {!hasPermissionDenied && !hasCorrectScope && (
        <Error customMessage={strings.errors.insufficientPermission} />
      )}

      {isLoading && <Loading task="fetch persistent token" />}

      {fetchError && (
        <Error
          statusCode={fetchError.statusCode || fetchError.response?.status}
          message={fetchError.message}
        />
      )}

      {(hasPermissionDenied || !hasCorrectScope) && (
        <button onClick={() => navigate("/authenticate")}>Try again</button>
      )}

      {fetchError && (
        <RevokeAndClear
          clearRefreshToken={() => setRefreshToken(null)}
          to="/"
        />
      )}
    </>
  );
}
