var express = require("express");
var customerRepo = require("../repos/customerRepo");
var _ = require("lodash");

var router = express.Router();

router.get("/customers", (req, res) => {
  customerRepo
    .getCustomers()
    .then(rows => {
      res.statusCode = 200;
      // res.json(rows);
      res.send(
        _.sortBy(JSON.parse(JSON.stringify(rows)), [
          function(o) {
            return o.createdAt;
          }
        ]).reverse()
      );
    })
    .catch(err => {
      console.log(err);
      res.status(500).end("View error log on console");
    });
});

module.exports = router;
