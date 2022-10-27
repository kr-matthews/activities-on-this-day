import { Navigate, Route, Routes } from "react-router-dom";

import Authentication from "./components/pages/Authentication";
import Redirect from "./components/pages/Redirect";
import View from "./components/pages/View";

import { useSavedState } from "./hooks/useSavedState";

import logoPoweredByStrava from "./assets/logo_powered_by_strava.svg";

export default function App() {
  const [refreshToken, setRefreshToken] = useSavedState("refresh", null);
  const hasRefreshToken = !!refreshToken;

  const showDevOptions = process.env.REACT_APP_ENV === "LOCAL";

  return (
    <>
      <h1>Activities On-This-Day [WIP]</h1>

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

      {showDevOptions && (
        <div>
          <button
            onClick={() => {
              setRefreshToken(null);
            }}
          >
            Clear refresh token
          </button>
        </div>
      )}

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
// !!!: add common Links component; move 'powered by' there
