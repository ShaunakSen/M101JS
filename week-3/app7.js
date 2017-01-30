var MongoClient = require('mongodb').MongoClient;
var Twitter = require('twitter');
var assert = require('assert');


// load the environment variables
require('dotenv').load();

// housekeeping stuff

var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// fun starts here!!

MongoClient.connect("mongodb://localhost:27017/social_feed", function (err, db) {

    assert.equal(err, null);
    console.log("Successfully connected to mongoDB :)");

    var screenNames = ["Marvel", "DCComics", "TheRealStanLee"];

    var done = 0;

    screenNames.forEach(function (screenName) {

        // create cursor
        var cursor = db.collection("statuses").find({"user.screen_name": screenName});
        cursor.sort({"id": -1});
        cursor.limit(1);

        // prepared cursor to get the last doc

        // fetch the doc
        cursor.toArray(function (err, docs) {
            assert.equal(err, null);

            var params;
            if (docs.length == 1) {
                // this means that already we have run this app once
                params = {"screen_name": screenName, "since_id": docs[0].id, "count": 10};

            } else {
                // running for 1st time.. no need of since_id param
                params = {"screen_name": screenName, "count": 10};
            }

            client.get("statuses/user_timeline", params, function (err, statuses, response) {
                assert.equal(err, null);

                // insert the new statuses

                db.collection("statuses").insertMany(statuses, function (err, res) {

                    console.log(res);
                    done += 1;
                    if (done == screenNames.length) {
                        // finished
                        db.close();
                    }
                });
            });
        });
    });

});



























