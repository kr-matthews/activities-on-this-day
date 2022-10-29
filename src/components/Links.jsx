import "./links.css";

import gitHubImage from "../assets/github.png";
import gitHubImageDark from "../assets/github-dark.png";
import websiteImage from "../assets/website-logo.svg";

// note: sadly this is a copy-paste from previous projects, with a slight modification to allow children
// should make it a dependency via npm package

function Links({ gitHubLink, themeType = "light", children }) {
  const links = [
    ["Personal Website", "https://kr-matthews.github.io/", websiteImage],
    [
      "Project Repository",
      gitHubLink,
      themeType === "light" ? gitHubImage : gitHubImageDark,
    ],
  ];

  return (
    <div className="link-footer">
      {links.map(([description, url, image]) => (
        <Link key={url} description={description} url={url} image={image} />
      ))}
      {children}
    </div>
  );
}

function Link({ url, image, description }) {
  return (
    <a
      href={url}
      className="link-tooltip-container"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img className="link-image" src={image} alt="" />
      <span className="link-tooltip">{description}</span>
    </a>
  );
}

export default Links;
