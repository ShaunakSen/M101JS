// monggo node driver example

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

MongoClient.connect('mongodb://localhost:27017/school_huge_db', function (err, db) {
    assert.equal(null, err);

    console.log("Successfully connected to the server");

    db.collection('students').drop();
    types = ['exam', 'quiz', 'homework', 'homework'];
    // 1 million students
    for (var i = 0; i < 1000000; i++) {

        // take 10 classes
        for (class_counter = 0; class_counter < 10; class_counter++) {
            scores = [];
            // and each class has 4 grades
            for (j = 0; j < 4; j++) {
                scores.push({'type': types[j], 'score': Math.random() * 100});
            }

            // there are 500 different classes that they can take
            class_id = Math.floor(Math.random() * 501); // get a class id between 0 and 500

            record = {'student_id': i, 'scores': scores, 'class_id': class_id};
            db.collection("students").insert(record);
        }
    }

});