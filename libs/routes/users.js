const express = require("express");
const passport = require("passport");
const router = express.Router();

const libs = process.cwd() + "/libs/";

const db = require(libs + "db/mongoose");

router.get(
    "/info",
    passport.authenticate("bearer", { session: false }),
    function(req, res) {
        res.json({
            user_id: req.user.userId,
            name: req.user.username,
            scope: req.authInfo.scope
        });
    }
);

module.exports = router;
