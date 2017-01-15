// intro to express

var express = require('express');
var engines = require('consolidate');

var app = express();

// settings to use template engine

// register nunjucks template engine as associated with html extension
app.engine("html", engines.nunjucks);

// set view engine to html
app.set("view engine", "html");

// location of templates is specified
app.set("views", __dirname + "/views");


app.get("/", function (req, res) {
    res.render("hello", {name: "Mini"});
});


// routes not handled by our route handler
app.use(function (req, res) {
    res.sendStatus(404);
});

var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log("Server listening on port %s", port);
});