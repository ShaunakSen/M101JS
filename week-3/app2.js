var MongoClient = require('mongodb');
var assert = require('assert');


MongoClient.connect("mongodb://localhost:27017/crunchbase", function (err, db) {

    assert.equal(err, null);
    console.log("Successfully connected to MongoDb");

    var query = {"category_code": "biotech"};

    var cursor = db.collection("companies").find(query);
    
    // assign cursor to a variable


    // cursor has forEach method
    // note cursor.forEach is not forEach method on arrays as cursor is not an array
    // 1st arg: callback for iterating through the docs
    // 2nd arg: what to doo when cursor is exhausted or there is an error

    // here the cursor gets docs in batches not at once 
    cursor.forEach(
        function (doc) {
            console.log(doc.name + " is a " + doc.category_code + " company");
        },
        function (err) {
            assert.equal(err, null);
            db.close();
        }
    );


});
