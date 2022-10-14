import * as dotenv from "dotenv";
dotenv.config();

export const handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify(process.env.TEST_CLIENT_SECRET_TWO),
  };
};
