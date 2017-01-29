var MongoClient = require('mongodb');
var assert = require('assert');
var commandLineArgs = require('command-line-args');

var options = commandLineOptions();

console.log(options);


// now that we have got correct args connect to db

MongoClient.connect("mongodb://localhost:27017/crunchbase", function (err, db) {

    assert.equal(err, null);
    console.log("Successfully connected to MongoDb");

    var query = queryDocument(options);

    var projection = {"_id": 0, "name": 1, "founded_year": 1, "number_of_employees": 1, "crunchbase_url": 1};

    // this DOES not fetch docs from db.. it simply returns cursor.. so it is synchronous
    var cursor = db.collection("companies").find(query, projection);

    var numMatches = 0;

    // cursor has forEach method
    // note cursor.forEach is not forEach method on arrays as cursor is not an array
    // 1st arg: callback for iterating through the docs
    // 2nd arg: what to do when cursor is exhausted or there is an error

    // here the cursor gets docs in batches not at once
    cursor.forEach(
        function (doc) {
            numMatches += 1;
            console.log(doc);
        },
        function (err) {
            assert.equal(err, null);
            console.log("Our query was: " + JSON.stringify(query));
            console.log("Matching docs: " + numMatches);
            return db.close();
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


function queryDocument(options) {

    // construct query object here from options

    var query = {
        "founded_year": {
            "$gte": options.firstYear,
            "$lte": options.lastYear
        }
    };

    if("employees" in options){
        query.number_of_employees = {"$gte": options.employees};
    }

    return query;
}