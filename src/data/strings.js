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
      "This is a simple app which displays your Strava activities that were recorded on this day in history. In order to see your activities, you'll need to provide permission for the app to access your Strava activities via the button below. Once granted, you can revoke this access at any time by following the instructions which will appear at the bottom of this page.",
    alreadyAuthenticated:
      "You've already provided permission for the app to access your Strava activities; you don't need to provide it again. Doing so again will replace any previously stored permissions. To clear permissions and activities stored in the app and revoke access on Strava, continue to your activities and follow the instructions at the bottom of the page.",
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
    revokeAccess4: "clear stored data",
  },

  links: {
    gitHubRepo: "https://github.com/kr-matthews/activities-on-this-day",
    revokeAccess: "https://www.strava.com/settings/apps",
  },

  errors: {
    permissionDenied:
      "You didn't click 'authorize' on the Strava permissions page. Try again.",
    insufficientPermission:
      "You didn't provide permission to view private activities. Try again.",

    strava400: "Bad request.",
    badCode:
      "The code from your authorization may have expired, try starting again.",

    strava401: "Unauthorized.",
    unauthorized:
      "The app's permission to access your Strava seems to have been revoked, possibly due to expiration. Clear stored data - see below - then try again.",

    strava403: "Forbidden; you cannot access.",
    forbidden:
      "The app has permission to access your Strava, but this request failed for some reason. Try again tomorrow. If this persists, create an issue on GitHub - link at bottom of this page.",

    strava404:
      "Not found; the requested asset does not exist, or you are not authorized to see it.",
    genericExplanation:
      "Something went wrong. Try again tomorrow. If this persists, create an issue on GitHub - link at bottom of this page.",

    strava429: "Too Many Requests; you have exceeded rate limits.",
    rateLimitExplanation:
      "Try again in 15 minutes - may not work until tomorrow.",

    strava500:
      "Strava is having issues, please check https://status.strava.com.",
    stravaIssues:
      "The problem appears to be on Strava's end - try again later.",
  },

  dev: {
    goToAuth: "Visit /authentication",
    setToYesterday: "yesterday -> Fetched",
    clearActivities: "Clear Activities",
  },
};

export default strings;
