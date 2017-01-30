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

    var projection = projectionDocument(options);

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
        {name: "employees", alias: "e", type: Number},
        {name: "ipo", alias: "i", type: String},
        {name: "country", alias: "c", type: String},
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

    // ======= 3 ways of assigning values to js objects ========

    var query = {
        "founded_year": {
            "$gte": options.firstYear,
            "$lte": options.lastYear
        }
    };

    if ("employees" in options) {
        query.number_of_employees = {"$gte": options.employees};
    }

    // ipo args
    if ("ipo" in options) {
        if (options.ipo == "yes") {

            // fetch docs where ipo exists and not null

            query["ipo.valuation_amount"] = {"$exists": true, "$ne": null};
        } else if (options.ipo == "no") {

            // fetch docs of companies where ipo does not exists or are set to null
            query["ipo.valuation_amount"] = null;
        }
    }

    if ("country" in options) {
        query["offices.country_code"] = options.country;
    }


    return query;
}


function projectionDocument(options) {
    var projection = {"_id": 0, "name": 1, "founded_year": 1, "crunchbase_url": 1};

    if ("employees" in options) {
        projection.number_of_employees = 1;
    }
    if ("ipo" in options) {
        projection["ipo.valuation_amount"] = 1;
    }
    
    if ("country" in options){
        projection["offices.country_code"] = 1;
    }

    return projection;
}

