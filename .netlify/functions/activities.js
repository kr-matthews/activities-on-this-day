import axios from "axios";
const FormData = require("form-data");
import * as dotenv from "dotenv";
dotenv.config();

export const handler = async (event, context) => {
  try {
    // first, get the (temporary) access token via the (fixed) refresh token
    const oauthForm = new FormData();
    oauthForm.append("client_id", process.env.REACT_APP_CLIENT_ID);
    oauthForm.append("client_secret", process.env.CLIENT_SECRET);
    oauthForm.append("refresh_token", event.queryStringParameters.refresh);
    oauthForm.append("grant_type", "refresh_token");

    const oauthResponse = await axios.post(
      "https://www.strava.com/oauth/token",
      oauthForm,
      {
        headers: {
          ...oauthForm.getHeaders(),
        },
      }
    );

    // next, get the activities via the access token

    const activitiesResponse = await axios.get(
      `https://www.strava.com/api/v3/athlete/activities`,
      {
        params: { access_token: oauthResponse.data.access_token },
      }
    );

    console.info("activity res", activitiesResponse);

    return {
      statusCode: 200,
      body: JSON.stringify(activitiesResponse.data),
    };
  } catch (e) {
    return {
      statusCode: e.response.status,
      body: JSON.stringify(e.response.data.message),
    };
  }
};
