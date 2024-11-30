const ApiError = require("../Utils/apiError");

const handleJwtInvalidSignature = () =>
  new ApiError("Invalid Token PLZ login again", 401);

const handleJwtExpired = () =>
  new ApiError("expired Token PLZ login again", 401);

const globalError = (err, req, res, next) => {
  err.statuscode = err.statuscode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV == "development") {
    sendErrorForDev(err, res);
  } else {
    if (err.name == "JsonWebTokenError") err = handleJwtInvalidSignature();
    if (err.name == "TokenExpiredError") err = handleJwtExpired();
    sendErrorForprod(err, res);
  }
};

const sendErrorForDev = (err, res) =>
  res.status(err.statuscode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });

const sendErrorForprod = (err, res) =>
  res.status(err.statuscode).json({
    status: err.status,
    message: err.message,
  });

module.exports = globalError;
