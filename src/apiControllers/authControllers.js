var express = require("express");
var uid = require("rand-token").uid;
var authRepo = require("../repos/authRepo");

var router = express.Router();

//Add new user
router.post("/user", (req, res) => {
  var id = uid(10);
  authRepo
    .add(req.body, id)
    .then(value => {
      console.log(value);
      res.statusCode = 201;
      res.json(req.body);
    })
    .catch(err => {
      console.log(err);
      res.statusCode = 500;
      res.end(
        "View error log on console. Maybe Duplicate email for key f_email_UNIQUE"
      );
    });
});
//handle login
router.post("/login", (req, res) => {
  authRepo
    .login(req.body)
    .then(rows => {
      if (rows.length > 0) {
        var userEntity = rows[0];
        var acToken = authRepo.generateAccessToken(userEntity);
        var rfToken = authRepo.generateRefreshToken();

        authRepo
          .updateRefreshToken(userEntity.f_id, rfToken)
          .then(() => {
            res.json({
              auth: true,
              access_token: acToken,
              refresh_token: rfToken,              
              name: userEntity.f_name,
              type: userEntity.f_type
            });
          })
          .catch(err => {
            console.log(err);
            res.statusCode = 500;
            res.end("View error log on console");
          });
      } else {
        res.json({
          auth: false
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.statusCode = 500;
      res.end("View error log on console");
    });
});
//get new accessToken

router.post("/token", (req, res) => {
  let refToken = req.headers["x-ref-token"];
  console.log(refToken);
  if (refToken !== "") {
    authRepo
      .getNewAccessToken(refToken)
      .then(value => {
        console.log("then -> ");
        console.log(value);
        res.json({
          access_token: value
        });
      })
      .catch(err => {
        console.log("catch ->");
        console.log(err);
        if (err.errMsg === "DB_QUERY_ERROR") {
          res.statusCode = 500;
          res.json({
            msg: "Server error"
          });
        } else {
          res.statusCode = 401;
          res.json({
            msg: err.errMsg
          });
        }
      });
  } else {
    res.statusCode = 401;
    res.json({
      msg: "Unauthorized"
    });
  }
});

module.exports = router;
