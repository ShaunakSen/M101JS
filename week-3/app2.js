var MongoClient = require('mongodb');
var assert = require('assert');


MongoClient.connect("mongodb://localhost:27017/crunchbase", function (err, db) {

    assert.equal(err, null);
    console.log("Successfully connected to MongoDb");

    var query = {"category_code": "biotech"};

    var projection = {"name": 1, "category_code": 1, "_id": 0};

    // this DOES not fetch docs from db.. it simply returns cursor.. so it is synchronous
    var cursor = db.collection("companies").find(query);

    // modify cursor with a field projection
    cursor.project(projection);
    
    // assign cursor to a variable


    // cursor has forEach method
    // note cursor.forEach is not forEach method on arrays as cursor is not an array
    // 1st arg: callback for iterating through the docs
    // 2nd arg: what to do when cursor is exhausted or there is an error

    // here the cursor gets docs in batches not at once 
    cursor.forEach(
        function (doc) {
            console.log(doc.name + " is a " + doc.category_code + " company");
            console.log(doc);
        },
        function (err) {
            assert.equal(err, null);
            db.close();
        }
    );


});
