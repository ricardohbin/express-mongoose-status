/**jshint node:true*/
"use strict";
var _ = require("lodash");

module.exports = function (err, res, data, status, canBeEmpty) {
  canBeEmpty = canBeEmpty || false;
  if (err) {
    return handleErrors(res, err);
  }
  handleResults(res, data, status, canBeEmpty);
};

function handleErrors (res, err) {
  var statusCode = 500;

  switch (err.name) {
    case "ValidationError":
    case "CastError":
      statusCode = 400;
      //It isn't a validation/cast error to user. Let's considerate that this id doesn't exists at all.
      if (err.type === "ObjectId") {
        err = null;
        statusCode = 404;
      }
      break;
    case "MongoError":
      statusCode = getMongoErrorsCode(err.code);
      break;
  }

  if (!_.isObject(err)) {
    return res.sendStatus(statusCode);
  }

  res.status(statusCode).send(err.toString());
}

function handleResults (res, data, status, canBeEmpty) {
  status = status || 200;
  if (_.isEmpty(data) && !canBeEmpty) {
    return res.sendStatus(404);
  }

  res.status(status).send(data);
}

function getMongoErrorsCode (code) {
  var codes = {
    "11000": 409
  };

  return codes[code] || 500;
}
