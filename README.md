#express mongoose status

This is a simple lib to handle mongoose responses and convert them to correct HTTP status in a REST API using Express

##Problems in common mongoose + express usage
Many code around the web, you can see something like this (when the *err* has error handler...):
```js
route.get("/some/route/:id", function (req, res, next) {
  MongooseModel.find({"_id": req.params.id }, function (err, data) {
    if (err) {
      return res.status(500).send(err.name); //or next(err), res.sendStatus(500) etc
    }
    res.send(data);
  });
});
```
###Whats the problem with follow approach?
+ Any kind of error will throws status **500 Internal Error**
+ If the **param.id** isn't a ObjectId, it will throw a **CastError** (instead of **404 not found** behavior)
+ Any **ValidatorError** error will not throws a expected **400 Bad Request**
+ Even with valid ObjectId in **param.id**, successful, but empty responses will throw a **200 OK**

###Why not just abstract this? Why repeat yourself with a lot of validations?
```js
var statusHandler = require("express-mongoose-status");
route.get("/some/route/:id", function (req, res, next) {
  MongooseModel.find({"_id": req.params.id }, function (err, data) {
    statusHandler(err, res, data);
  });
});
```

###Installation
```sh
npm install express-mongoose-status --save
```
