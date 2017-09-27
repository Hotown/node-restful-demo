const mongoose = require("mongoose"),
    crypto = require("crypto"),
    Schema = mongoose.Schema,
    User = new Schema({
        username: {
            type: String,
            unique: true,
            required: true
        },
        hashedPassword: {
            type: String,
            require: true
        },
        salt: {
            type: String,
            require: true
        },
        created: {
            type: Date,
            default: Date.now()
        }
    });
// 定义User的方法
User.methods.encryptPassword = function(password) {
    return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
};

// 定义User的虚拟属性，虚拟属性不会存入数据库
User.virtual("password")
    .set(function(password) {
        this._plainPassword = password;
        this.salt = crypto.randomBytes(32).toString("hex");
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() {
        return this._plainPassword;
    });

User.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

module.exports = mongoose.model("User", User);
