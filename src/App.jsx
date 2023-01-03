import { Navigate, Route, Routes } from "react-router-dom";
import {
  WithHeavyFooter,
  Body,
  HeavyFooter,
  HomeLink,
  CodeLink,
} from "footer-dependency/dist/lib";

import Authentication from "./components/pages/Authentication";
import Redirect from "./components/pages/Redirect";
import View from "./components/pages/View";
import Sample from "./components/pages/Sample";

import { useSavedState } from "./hooks/useSavedState";
import strings from "./data/strings";
import logoPoweredByStrava from "./assets/logo_powered_by_strava.svg";

export default function App() {
  const [refreshToken, setRefreshToken] = useSavedState("refresh", null);
  const hasRefreshToken = !!refreshToken;

  return (
    <WithHeavyFooter>
      <Body>
        <Routes>
          <Route
            path="authenticate"
            element={<Authentication hasRefreshToken={!!refreshToken} />}
          />

          <Route
            path="redirect"
            element={<Redirect setRefreshToken={setRefreshToken} />}
          />

          <Route path="sample" element={<Sample />} />

          <Route
            path="/"
            element={
              hasRefreshToken ? (
                <View
                  refreshToken={refreshToken}
                  clearRefreshToken={() => setRefreshToken(null)}
                />
              ) : (
                <Navigate to="/authenticate" />
              )
            }
          />

          <Route
            path="*"
            element={<Navigate to="/" />}
            options={{ replace: true }}
          />
        </Routes>
      </Body>

      <HeavyFooter>
        <HomeLink />
        <CodeLink gitHubLink={strings.links.gitHubRepo} />
        <img
          src={logoPoweredByStrava}
          style={{ width: 200 }}
          alt="Powered by Strava"
        />
      </HeavyFooter>
    </WithHeavyFooter>
  );
}
