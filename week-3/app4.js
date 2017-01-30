// using $regex


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
    var cursor = db.collection("companies").find(query);
    cursor.project(projection);

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
        {name: "overview", alias: "o", type: String},
        {name: "milestones", alias: "m", type: String},
    ]);

    // type:Number parses the data as Number

    var options = cli.parse();

    if (Object.keys(options).length < 1) {
        console.log(cli.getUsage({
            title: "Usage",
            description: "Supply the required argument"
        }));
        process.exit();
    }

    return options;
}


function queryDocument(options) {

    // construct query object here from options

    var query = {};

    if("overview" in options){
        // $options:i signifies case insensitive match
        query.overview = {"$regex": options.overview, "$options": "i"};
    }
    if("milestones" in options){
        // need to use array like syntax here
        query["milestones.source_description"] = {"$regex": options.milestones, "$options": "i"};
    }

    return query;
}

function projectionDocument(options) {
    var projection = {"_id": 0, "name": 1, "founded_year": 1, "overview": 1};

    if("overview" in options){
        projection.overview = 1;
    }
    if("milestones" in options){
        projection["milestones.source_description"] = 1;
    }

    return projection;
}

