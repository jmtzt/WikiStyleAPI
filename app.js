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

// Requests targeting all articles

app.route("/articles")
    .get(function (req, res) {

        Article.find(function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            }
            else {
                res.send(err);
            }
        });
    })
    .post(function (req, res) {

        const article = new Article({ title: req.body.title, content: req.body.content });

        article.save(function (err) {
            if (err) {
                console.log(err);
            }
            else {
                res.send("Article added sucessfully!");
            }
        });


    })
    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("Deleted all articles sucessfully!");
            }
            else {
                res.send(err);
            }
        })
    })

// Requests targeting a specific article

app.route("/articles/:articleTitle")
    .get(function (req, res) {
        Article.findOne({ title: req.params.articleTitle }, function (err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            }
            else {
                res.send("No articles matching that title was found.");
            }
        });
    })
    .put(function (req, res) {
        Article.updateOne(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            { overwrite: true },
            function (err) {
                if (!err) {
                    res.send("Sucessfully updated article.");
                }
                else {
                    res.send("Error updating article.");
                }
            })
    })
    .patch(function (req, res) {
        Article.updateOne(
            { title: req.params.articleTitle },
            { $set: req.body },
            { overwrite: false },
            function (err) {
                if (!err) {
                    res.send("Sucessfully patched article.");
                }
                else {
                    res.send("Error patching article.");
                }
            }
        )
    })
    .delete(function (req, res) {
        Article.deleteOne(
            { title: req.params.articleTitle },
            function (err) {
                if (!err) {
                    res.send("Sucessfully deleted article.");
                }
                else {
                    res.send("Error deleting article.");
                }
            }
        )
    });

app.listen(3000, function () {
    console.log("Server started on port 3000");
});