const strings = {
  headings: {
    appName: "Activities On-This-Day",
    options: "Display Options",
  },

  labels: {
    viewOnStrava: "View on Strava", // not allowed to change this
    tileLayer: "Map Type",
    lineColour: "Path Colour",
    lineWeight: "Path Width",
    resetOptions: "Reset Options",
    sample: "View Sample",
    activities: "Your Activities",
    tryIt: "Try It Yourself",
    note: "NOTE",
  },

  sentences: {
    description:
      "This is a simple app which displays your Strava activities that were recorded on this day in history. In order to see your activities, you'll need to provide permission for the app to access your Strava activities via the button below. Once granted, you can revoke this access at any time by going to your settings on Strava's website, and a link will be provided at the bottom of the page.",
    alreadyAuthenticated:
      "You've already provided permission for the app to access your Strava activities; you don't need to provide it again. Doing so again will replace any previously stored permissions. To clear permissions and activities stored in the app and revoke access on Strava, continue to your activities and follow the instructions there.",
    sample:
      "Don't have Strava, or don't want to provide access? Check out what it would look like if you did.",
    sampleWarning: "These are sample activities, not your real activities.",
    noActivities:
      "You don't have any activities on this day in history. Check out the sample page to see what if would look like if you did.",
  },

  fragments: {
    revokeAccess1: "To clear permissions and data, first ",
    revokeAccess2: "revoke access on Strava",
    revokeAccess3: " then ",
    revokeAccess4: "clear stored data.",
  },

  links: {
    gitHubRepo: "https://github.com/kr-matthews/activities-on-this-day",
    revokeAccess: "https://www.strava.com/settings/apps",
  },

  errors: {},

  dev: {
    goToAuth: "Visit /authentication",
    setToYesterday: "yesterday -> Fetched",
    clearActivities: "Clear Activities",
  },
};

export default strings;
