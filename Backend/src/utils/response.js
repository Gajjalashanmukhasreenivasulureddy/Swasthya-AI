function success(response, data, statusCode = 200) {
  return response.status(statusCode).json({ success: true, data });
}

function failure(response, message, statusCode = 400) {
  return response.status(statusCode).json({
    success: false,
    error: { message }
  });
}

module.exports = { success, failure };