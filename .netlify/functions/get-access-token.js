import axios from "axios";
const FormData = require("form-data");
import * as dotenv from "dotenv";
dotenv.config();

export const handler = async (event, context) => {
  try {
    const oauthForm = new FormData();
    oauthForm.append("client_id", process.env.REACT_APP_CLIENT_ID);
    oauthForm.append("client_secret", process.env.CLIENT_SECRET);
    oauthForm.append("refresh_token", event.queryStringParameters.refresh);
    oauthForm.append("grant_type", "refresh_token");

    const response = await axios.post(
      "https://www.strava.com/oauth/token",
      oauthForm,
      {
        headers: {
          ...oauthForm.getHeaders(),
        },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (e) {
    return {
      statusCode: e.response.status,
      body: JSON.stringify(e.response.data.message),
    };
  }
};
