var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var docs = [{"_id": 1, "student": "Mary", "grade": 45, "assignment": "homework"},
{"_id": 2, "student": "Alice", "grade": 48, "assignment": "homework"},
{"_id": 3, "student": "Fiona", "grade": 16, "assignment": "quiz"},
{"_id": 4, "student": "Wendy", "grade": 12, "assignment": "homework"},
{"_id": 5, "student": "Samantha", "grade": 82, "assignment": "homework"},
{"_id": 6, "student": "Fay", "grade": 89, "assignment": "quiz"},
{"_id": 7, "student": "Katherine", "grade": 77, "assignment": "quiz"},
{"_id": 8, "student": "Stacy", "grade": 73, "assignment": "quiz"},
{"_id": 9, "student": "Sam", "grade": 61, "assignment": "homework"},
{"_id": 10, "student": "Tom", "grade": 67, "assignment": "exam"},
{"_id": 11, "student": "Ted", "grade": 52, "assignment": "exam"},
{"_id": 12, "student": "Bill", "grade": 59, "assignment": "exam"},
{"_id": 13, "student": "Bob", "grade": 37, "assignment": "exam"},
{"_id": 14, "student": "Seamus", "grade": 33, "assignment": "exam"},
{"_id": 15, "student": "Kim", "grade": 28, "assignment": "quiz"},
{"_id": 16, "student": "Sacha", "grade": 23, "assignment": "quiz"},
{"_id": 17, "student": "David", "grade": 5, "assignment": "exam"},
{"_id": 18, "student": "Steve", "grade": 9, "assignment": "homework"},
{"_id": 19, "student": "Burt", "grade": 90, "assignment": "quiz"},
{"_id": 20, "student": "Stan", "grade": 92, "assignment": "exam"}];

MongoClient.connect("mongodb://localhost:27017/test", function (err, db) {
    assert.equal(err, null);
    console.log("connected to db");

    /*docs.forEach(function (doc) {
        db.collection("grades").insertOne(doc, function (err, doc) {

            assert.equal(err, null);
            console.log("Inserted doc: " + doc);
        })
    });*/
    var cursor = db.collection("grades").find({});
    cursor.skip(6);
    cursor.limit(2);
    cursor.sort({"grade": 1});

    cursor.toArray(function (err, docs) {
        console.log(docs);
    })

});