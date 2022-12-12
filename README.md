# Activities On-This-Day

![Screenshot](public/android-chrome-192x192.png)

This is a single-page application working with serverless functions to display your historical activities from Strava, specifically those which were recorded on this day in history.

The app is accessible at [https://activities-on-this-day.netlify.app/](https://activities-on-this-day.netlify.app/).

[![Netlify Status](https://api.netlify.com/api/v1/badges/e79fc32d-de94-409e-935d-7403775536bd/deploy-status)](https://app.netlify.com/sites/activities-on-this-day/deploys)

**Note that this is NOT an official Strava app, and is NOT endorsed by Strava.**

// todo: TIDY - add screenshot(s) once samples are updated

## Features

### Current

- Authenticate with Strava oauth.
- Retain refresh token to stay logged in until access is explicitly revoked.
- Find year of earliest activity (once ever) and only search that and later years (daily when opened).
- If not already done today, fetch an access token and then fetch activities from Strava.
- Display activities with maps, partitioned by year.
- Maximize maps to near-full screen.
- Play/pause simple path animation to visually show direction travelled.

### Potential Future

See [enhancements](https://github.com/kr-matthews/activities-on-this-day/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement) on GitHub.

## Original Intentions

- Fetch data from an API.
- Handle tokens and credentials securely.
- Simple and minimal UI.
- Something that's actually (slightly) useful, compared to my previous game-based projects.

## Focus

- Working with APIs and (Netlify) serverless functions.
- Separation of concerns via hooks.
- Optimizing API requests to stay within limits.
- Handling tokens within a single-page application.
- Clean navigation using React Router.

## Flaws

See the [issues](https://github.com/kr-matthews/activities-on-this-day/issues) on GitHub, in addition to the following:

- No tests at all.
- Date manipulated is ad hoc and inconsistent.
- Styling is inconsistent and messy - half in-line, half css files.
- No thought to accessibility.
- Only in english.
- Path animation doesn't reflect actual speed nor stoppages.
