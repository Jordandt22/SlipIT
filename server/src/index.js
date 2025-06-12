require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const rateLimiter = require("express-rate-limit");
const slowDown = require("express-slow-down");
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
app.use(express.json());
if (notProduction) {
  app.use(morgan("dev"));
} else {
  app.enable("trust proxy");
  app.set("trust proxy", 1);
}

// Rate & Speed Limiter Info
const timeLimit = 1000 * 60;
const maxReq = 300;
const limiter = rateLimiter({
  windowMs: timeLimit,
  max: maxReq,
});
const speedLimiter = slowDown({
  windowMs: timeLimit,
  delayAfter: maxReq / 2,
  delayMs: () => 250,
});

// Rate & Speed Limiters
app.use(speedLimiter);
app.use(limiter);

// Landing Page Route
app.get("/", (req, res) => {
  res.send("SlipIT API Server is Up and Running !");
});

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

// PORT and Sever
const PORT = process.env.PORT || 8000;
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`CORS Enabled Server, Listening to port: ${PORT}...`);
});

// Export the Express API
module.exports = server;
