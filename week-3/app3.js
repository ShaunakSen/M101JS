var MongoClient = require('mongodb');
var assert = require('assert');
var commandLineArgs = require('command-line-args');

var options = commandLineOptions();

console.log(options);


// now that we have got correct args connect to db

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

function commandLineOptions() {
    var cli = commandLineArgs([
        {name: "firstYear", alias: "f", type: Number},
        {name: "lastYear", alias: "l", type: Number},
        {name: "employees", alias: "e", type: Number}
    ]);
    
    // type:Number parses the data as Number

    var options = cli.parse();

    if (!(("firstYear" in options) && ("lastYear" in options))) {
        console.log(cli.getUsage({
            title: "Usage",
            description: "First year and last year are required arguments"
        }));
        process.exit();
    }

    return options;
}