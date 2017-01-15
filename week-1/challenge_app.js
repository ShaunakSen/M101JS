var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var engines = require('consolidate');
var assert = require('assert');
var bodyParser = require('body-parser');


var app = express();

// settings to use template engine

// register nunjucks template engine as associated with html extension
app.engine("html", engines.nunjucks);

// set view engine to html
app.set("view engine", "html");

// location of templates is specified
app.set("views", __dirname + "/views");
app.use(bodyParser.urlencoded({extended: true}));


MongoClient.connect("mongodb://localhost:27017/video", function (err, db) {
    assert.equal(err, null);
    console.log("Successfully connected to mongo server");

    app.get("/movies", function (req, res) {
        res.render("movie_form");
    });

    app.post("/movies", function (req, res) {
        var movie = req.body.movie;
        console.log(movie);
        db.collection("movies").insertOne(movie, function (err) {
            assert.equal(err, null);
            console.log("Inserted movie");
            console.log(movie);
            res.json(movie);
        });
    });

    // routes not handled by our route handler
    app.use(function (req, res) {
        res.sendStatus(404);
    });

    var server = app.listen(3000, function () {
        var port = server.address().port;
        console.log("Server listening on port %s", port);
    });
});
