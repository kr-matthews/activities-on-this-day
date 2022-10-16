import axios from "axios";
const FormData = require("form-data");
import * as dotenv from "dotenv";
dotenv.config();

export const handler = async (event, context) => {
  const form = new FormData();
  form.append("client_id", process.env.REACT_APP_CLIENT_ID);
  form.append("client_secret", process.env.CLIENT_SECRET);
  form.append("code", event.queryStringParameters.code);
  form.append("grant_type", "authorization_code");

  try {
    const response = await axios.post(
      "https://www.strava.com/oauth/token",
      form,
      {
        headers: {
          ...form.getHeaders(),
        },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(response.data.refresh_token),
    };
  } catch (e) {
    return { statusCode: e.response.status, body: JSON.stringify(e.message) };
  }
};
