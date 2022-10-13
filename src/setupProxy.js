import { createProxyMiddleware } from "http-proxy-middleware";

export default function (app) {
  app.use(
    "/.netlify/functions/",
    createProxyMiddleware({
      target: "http://localhost:9000/",
      pathRewrite: {
        "^\\.netlify/functions": "",
      },
    })
  );
}
