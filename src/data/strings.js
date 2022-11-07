const strings = {
  headings: {
    appName: "Activities On-This-Day",
    options: "Display Options",
  },

  labels: {
    viewOnStrava: "View on Strava", // not allowed to change this
    revokeAccess: "Revoke access on Strava",
    tileLayer: "Map Type",
    lineColour: "Path Colour",
    lineWeight: "Path Width",
    resetOptions: "Reset Options",
    sample: "View Sample",
    tryIt: "Try It Yourself",
  },

  sentences: {
    description:
      "This is a simple app which displays your Strava activities that were recorded on this day in history. In order to see your activities, you'll need to provide permission for the app to access your Strava activities via the button below. Once granted, you can revoke this access at any time by going to your settings on Strava's website, and a link will be provided at the button of the page.",
    sample:
      "Don't have Strava, or don't want to provide access? Check out what it would look like if you did.",
    sampleWarning: "Note: This is sample data, not your data.",
    noActivities:
      "You don't have any activities on this day in history. Check out the sample page to see what if would look like if you did.",
  },

  links: {
    gitHubRepo: "https://github.com/kr-matthews/activities-on-this-day",
    revokeAccess: "https://www.strava.com/settings/apps",
  },

  errors: {},

  dev: {
    goToAuth: "Go to authentication step",
    setToYesterday: "Set last fetched to yesterday",
    clearActivities: "Clear Activities",
    clearRefresh: "Clear refresh token",
    clearAll: "Clear all local storage",
  },
};

export default strings;
