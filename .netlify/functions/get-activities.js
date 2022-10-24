import axios from "axios";
const FormData = require("form-data");
import * as dotenv from "dotenv";
dotenv.config();

export const handler = async (event, context) => {
  try {
    const response = await axios.get(
      `https://www.strava.com/api/v3/athlete/activities`,
      {
        params: {
          access_token: event.queryStringParameters.access,
          before: event.queryStringParameters.before,
          after: event.queryStringParameters.after,
          per_page: 50,
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
