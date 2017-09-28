const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

// Imag数据结构
const Images = new Schema({
    kind: {
        type: String,
        enum: ["thumbnail", "detail"],
        required: true
    },
    url: {
        type: String,
        required: true
    }
});

// Article数据结构
const Article = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [Images],
    modified: {
        type: Date,
        default: Date.now
    }
});

// 增加验证逻辑
Article.path("title").validate(function (v) {
    return v.length > 5 && v.length < 70;
});

module.exports = mongoose.model("Aarticle", Article);