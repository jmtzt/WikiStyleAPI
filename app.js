//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true });

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

app.route("/articles").get(function (req, res) {

    Article.find(function (err, foundArticles) {
        if (!err) {
            res.send(foundArticles);
        }
        else {
            res.send(err);
        }
    });
}).post(function (req, res) {

    const article = new Article({ title: req.body.title, content: req.body.content });

    article.save(function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.send("Article added sucessfully!");
        }
    });


}).delete(function (req, res) {
    Article.deleteMany(function (err) {
        if (!err) {
            res.send("Deleted all articles sucessfully!");
        }
        else {
            res.send(err);
        }
    })
})






app.listen(3000, function () {
    console.log("Server started on port 3000");
});