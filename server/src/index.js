require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const { arcjetMiddleware } = require("./middleware/arcjet.mw");
const app = express();

// MongoDB Connection
require("./models/db");

// Middleware
const { NODE_ENV, WEB_URL, ADMIN_URL } = process.env;
const notProduction = NODE_ENV !== "production";
app.use(helmet());
app.use(
  cors({
    origin: [notProduction ? "http://localhost:3000" : WEB_URL, ADMIN_URL],
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
if (notProduction) {
  app.use(morgan("dev"));
} else {
  app.enable("trust proxy");
  app.set("trust proxy", 1);
}

// Landing Page Route
app.get("/", (req, res) => {
  res.send("SlipIT API Server is Up and Running !");
});

// Arcjet Middleware
app.use(arcjetMiddleware);

// ---- API Routes ----

// Routes for Users
app.use(
  `/v${process.env.API_VERSION}/api/users`,
  require("./routes/users.routes")
);

// Routes for Players
app.use(
  `/v${process.env.API_VERSION}/api/players`,
  require("./routes/players.routes")
);

// Routes for Games
app.use(
  `/v${process.env.API_VERSION}/api/games`,
  require("./routes/games.routes")
);

// Routes for Leagues
app.use(
  `/v${process.env.API_VERSION}/api/leagues`,
  require("./routes/leagues.routes")
);

// Routes for Picks
app.use(
  `/v${process.env.API_VERSION}/api/picks`,
  require("./routes/picks.routes")
);

// PORT and Sever
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`CORS Enabled Server, Listening to port: ${PORT}...`);
});

// Export the Express API
module.exports = server;
