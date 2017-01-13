// monggo node driver example

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

MongoClient.connect('mongodb://localhost:27017/video', function (err, db) {
    assert.equal(null, err);

    console.log("Successfully connected to the server");

    // find() returns a cursor so we convert to array

    db.collection("movies").find({}).toArray(function (err, docs) {
        console.log(docs);
        console.log("================================");
        docs.forEach(function (doc) {
            console.log(doc.title);
        });

        db.close();
    });

    console.log("Called find....")
});