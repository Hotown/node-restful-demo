const passport = require("passport");
const BasicStrategy = require("passport-http").BasicStrategy;
const ClientPasswordStrategy = require("passport-oauth2-client-password").Strategy;
const BearerStrategy = require("passport-http-bearer").Strategy;

const libs = process.cwd() + "/libs/";

const config = require(libs + "config");

const User = require(libs + "model/user");
const Client = require(libs + "model/client");
const Token = require(libs + "model/token");
const refreshToken = require(libs + "model/refreshToken");

passport.use(
    new BasicStrategy(function (username, password, done) {
        Client.findOne({
            clientId: username
        }, function (err, client) {
            if (err) {
                return done(err);
            }

            if (!client) {
                return done(null, false);
            }

            if (client.clientSecret !== password) {
                return done(null, false);
            }

            return done(null, client);
        });
    })
);

passport.use(
    new ClientPasswordStrategy(function (clientId, clientSecret, done) {
        Client.findOne({
            clientId: clientId
        }, function (err, client) {
            if (err) {
                return done(err);
            }

            if (!client) {
                return done(null, false);
            }

            if (client.clientSecret !== clientSecret) {
                return done(null, false);
            }

            return done(null, client);
        });
    })
);

passport.use(
    new BearerStrategy(function (accessToken, done) {
        accessToken.findOne({
            token: accessToken
        }, function (err, token) {
            if (err) {
                return done(err);
            }

            if (!token) {
                return done(null, false);
            }

            if (
                Math.round((Date.now() - token.created) / 1000) >
                config.get("security:tokenLife")
            ) {
                Token.remove({
                    token: token
                }, function (err) {
                    if (err) {
                        return done(err);
                    }
                });

                return done(null, false, {
                    message: "Token expired"
                });
            }

            User.findById(token.userId, function (err, user) {
                if (err) {
                    return done(err);
                }

                if (!user) {
                    return done(null, false, {
                        message: "User Not Exist"
                    });
                }

                const info = {
                    scope: "*"
                };
                done(null, user, info);
            });
        });
    })
);