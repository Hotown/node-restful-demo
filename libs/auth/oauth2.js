const oauth2orize = require('oauth2orize');
const passport = require('passport');
const crypto = require('crypto');

const libs = process.cwd() + '/libs/';

const config = require(libs + 'config');
const log = require(libs + 'log')(module);

const db = require(libs + 'db/mongoose');
const User = require(libs + 'model/user');
const Token = require(libs + 'model/token');
const RefreshToken = require(libs + 'model/refreshToken');

// 创建OAuth2.0服务
const aserver = oauth2orize.createServer();

// 通用异常处理
const errFn = function (cb, err) {
    if (err) {
        return cb(err);
    }
}

const generateTokens = function (data, done) {
    let errHandler = errFn.bind(undefined, done),
        refreshToken,
        refreshTokenValue,
        token,
        tokenValue;

    RefreshToken.remove(data, errHandler);
    Token.remove(data, errHandler);

    tokenValue = crypto.randomBytes(32).toString('hex');
    refreshTokenValue = crypto.randomBytes(32).toString('hex');

    data.token = tokenValue;
    token = new Token(data);

    data.token = refreshTokenValue;
    refreshToken = new RefreshToken(data);

    refreshToken.save(errHandler);

    token.save(function (err) {
        if (err) {
            log.err(err);
            return done(err);
        }

        // 回调？？
        done(null, tokenValue, refreshTokenValue, {
            'expires_in': config.get('security:tokenLife')
        })
    });
};

// 通过 username & password 向授权服务器申请 access token.
aserver.exchange(oauth2orize.exchange.password(function (client, username, password, scope, done) {
    User.findOne({
        username: username
    }, function (err, user) {
        if (err) {
            return done(err);
        }

        if (!user || !user.checkPassword(password)) {
            return done(null, false);
        }

        const model = {
            userId: user.userId,
            clientId: client.clientId
        };

        generateTokens(model, done);
    })
}));


// 通过 refresh token 刷新 access token.
aserver.exchange(oauth2orize.exchange.refreshToken(function (client, refreshToken, scope, done) {
    RefreshToken.findOne({
        token: refreshToken,
        clientId: client.clientId
    }, function (err, token) {
        if (err) {
            return done(err);
        }

        if (!token) {
            return done(null, false);
        }

        User.findById(token.userId, function (err, user) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false);
            }

            const model = {
                userId: user.userId,
                clientId: client.clientId
            };

            generateTokens(model, done);
        });
    });
}));

exports.token = [
    passport.authenticate(['basic', 'oauth2-client-password'], {
        session: false
    }),
    aserver.token(),
    aserver.errorHandler()
];