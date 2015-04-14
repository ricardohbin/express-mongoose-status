/**jshint node:true*/
"use strict";
var _ = require("lodash");

/**
 * @param {Object} err - Mongoose error object
 * @param {Object} res  - Express response object
 * @param {Object} data  - json body
 * @param {number} status  - status to override 200, when it has a success
 * @param {boolean} canBeEmpty - returns success even the data is empty. Useful in collections
 */
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
      if (err.type === "ObjectId" && err.path === "_id") {
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
    "11000": 409 //conflict. The field already exists and its unique
  };

  return codes[code] || 500;
}
