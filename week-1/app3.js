// intro to express

var express = require('express');
var engines = require('consolidate');
var MongoClient = require('mongodb').MongoClient;
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

// Handler for internal server errors

function errorHandler(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500);
    res.render("error_template", {error: err});
}


app.use(errorHandler);


MongoClient.connect("mongodb://localhost:27017/video", function (err, db) {

    assert.equal(err, null);
    console.log("Successfully connected to mongo :)");

    app.get("/", function (req, res) {
        console.log("here");
        db.collection('movies').find({}).toArray( function (err, docs) {
            console.log("Received docs");
            console.log(docs);
            res.render("movies", {"movies": docs});
        });
    });


    // Accessing GET vars by express
    app.get("/names/:name", function(req, res){
        var name = req.params.name;
        // console.log("query vars: " + req.query);
        var getVar1 = req.query.getvar1;
        var getVar2 = req.query.getvar2;
        res.render("hello", {name: name, getvar1: getVar1, getvar2: getVar2});
    });

    // fruits route

    app.get("/fruits", function (req, res) {
        res.render("fruitPicker", {"fruits": ["apple", "orange", "grapes", "guava", "peach"]});
    });

    app.post("/fruits", function (req, res, next) {
        var favoriteFruit = req.body.fruit;
        if(typeof favoriteFruit == "undefined"){
            next(Error('Please chose a fruit'));
            // express will try to handle error
            // it will look for error handling middleware that we have registered
        } else {
            res.send("Your favorite fruit is " + favoriteFruit);
        }
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



