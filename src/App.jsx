import { Navigate, Route, Routes } from "react-router-dom";

import Authentication from "./components/pages/Authentication";
import Redirect from "./components/pages/Redirect";
import View from "./components/pages/View";
import Links from "./components/Links";

import { useSavedState } from "./hooks/useSavedState";

import strings from "./strings";

import logoPoweredByStrava from "./assets/logo_powered_by_strava.svg";

export default function App() {
  const [refreshToken, setRefreshToken] = useSavedState("refresh", null);
  const hasRefreshToken = !!refreshToken;

  const showDevOptions = process.env.REACT_APP_ENV === "LOCAL";

  return (
    <>
      <div className="non-footer">
        <h1>{strings.headings.appName}</h1>

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

          {/* // !!!: add a 'sample' path with fake activities displayed */}

          <Route
            path="*"
            element={<Navigate to="/" />}
            options={{ replace: true }}
          />
        </Routes>

        {showDevOptions && (
          <div>
            <button onClick={() => setRefreshToken(null)}>
              {strings.dev.clearRefresh}
            </button>
            <button onClick={() => localStorage.clear()}>
              {/* // !! redo this, make it available as part of revoke */}
              {strings.dev.clearAll}
            </button>
          </div>
        )}
      </div>

      <Links gitHubLink={strings.links.gitHubRepo}>
        <img
          src={logoPoweredByStrava}
          style={{ width: 200 }}
          alt="Powered by Strava"
        />
      </Links>
    </>
  );
}
