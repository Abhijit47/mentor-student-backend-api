const successResponse = (res, message, statusCode, data) => {
  // return console.log("Im from success response");
  return res.status(statusCode).json({ message: message, data: data });
};

const errorResponse = (res, message, statusCode) => {
  return res.status(statusCode).json({ message: message });
};

const errorCatch = (err) => {
  return console.log(err.message);
};

export { successResponse, errorResponse, errorCatch };