var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

MongoClient.connect("mongodb://localhost:27017/crunchbase", function (err, db) {
    assert.equal(err, null);
    console.log("Connected successfully to MongoDB");

    var query = {"permalink": {"$exists": true, "$ne": null}};
    var projection = {"permalink": 1, "updated_at": 1};


    var cursor = db.collection("companies").find(query);
    cursor.project(projection);
    cursor.sort({"permalink": 1});
    // sort by permalinks

    var markedForRemoval = [];
    var numToRemove = 0;

    var previous = {"permalink": "", "updated_at": ""};

    cursor.forEach(function (doc) {
        if ((doc.permalink == previous.permalink) && (doc.updated_at == previous.updated_at)) {
            // duplicate
            console.log(doc.permalink);
            markedForRemoval.push(doc._id);
            numToRemove += 1;
        }
        previous = doc;
    }, function (err) {
        // create filter
        var filter = {"_id": {"$in": markedForRemoval}};
        // delete
        db.collection("companies").deleteMany(filter, function (err, res) {
            console.log(res.result);
            console.log(markedForRemoval.length + " duplicates removed");
        });

        console.log("Repetitions:" + numToRemove);
        assert.equal(err, null);
        db.close();
    });
});
