const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const dbConnection = require("./Config/database");
dotenv.config({ path: "config.env" });
const MountRoutes = require("./Routes");

const ApiError = require("./Utils/apiError");
const GlobalError = require("./middleware/errorMiddleware");

// express app
const app = express();
dbConnection();
app.use(express.json({ limit: "20kb" }));

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

MountRoutes(app);
app.all("*", (req, res, next) => {
  next(new ApiError(`can't find thos route: ${req.originalUrl}`, 400));
});
//Global error handling middleware
app.use(GlobalError);

const { PORT } = process.env;

const server = app.listen(PORT, () => {
  console.log(`App running on ${PORT}`);
});

// Handel rejection error outside exprees
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
