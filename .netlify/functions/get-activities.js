import axios from "axios";
const FormData = require("form-data");
import * as dotenv from "dotenv";
dotenv.config();

export const handler = async (event, context) => {
  try {
    // !!! pass in time boundary parameters
    const response = await axios.get(
      `https://www.strava.com/api/v3/athlete/activities`,
      {
        params: { access_token: event.queryStringParameters.access },
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
