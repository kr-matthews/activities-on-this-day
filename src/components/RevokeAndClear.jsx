import { useNavigate } from "react-router";
import strings from "../data/strings";

export default function RevokeAndClear({
  clearRefreshToken = () => console.error("Can't clear refresh token."),
  to,
}) {
  const navigate = useNavigate();

  const clearData = () => {
    localStorage.clear();
    // changes to state affect local storage, but not vice versa
    // so explicitly clear refresh token
    clearRefreshToken();
    to && navigate(to);
  };

  return (
    <p>
      {strings.fragments.revokeAccess1}
      <a
        href={strings.links.revokeAccess}
        target="_blank"
        rel="noopener noreferrer"
      >
        {strings.fragments.revokeAccess2}
      </a>{" "}
      {strings.fragments.revokeAccess3}
      <button onClick={clearData}>{strings.fragments.revokeAccess4}</button>.
    </p>
  );
}
