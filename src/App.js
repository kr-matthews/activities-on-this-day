import { Navigate, Route, Routes } from "react-router-dom";

import Authentication from "./pages/Authentication";
import Redirect from "./pages/Redirect";
import View from "./pages/View";

import { useSavedState } from "./hooks/useSavedState";

import logoPoweredByStrava from "./assets/logo_powered_by_strava.svg";

export default function App() {
  const [refreshToken, setRefreshToken] = useSavedState("refresh", null);
  const hasRefreshToken = !!refreshToken;

  // todo add flags for dev? - show extra buttons for resetting access/refresh tokens, fetching activities again

  return (
    <>
      <h1>Activities On-This-Day [WIP]</h1>
      <div>
        <button
          onClick={() => {
            setRefreshToken(null);
          }}
        >
          Clear refresh token
        </button>
      </div>

      <Routes>
        <Route path="authenticate" element={<Authentication />} />

        <Route
          path="redirect"
          element={<Redirect setRefreshToken={setRefreshToken} />}
        />

        <Route
          path="/"
          element={
            hasRefreshToken ? (
              <View refreshToken={refreshToken} />
            ) : (
              <Navigate to="/authenticate" />
            )
          }
        />
      </Routes>

      <div>
        <img
          src={logoPoweredByStrava}
          style={{ width: 200 }}
          alt="Powered by Strava"
        />
      </div>
    </>
  );
}
// todo: add common Links component
