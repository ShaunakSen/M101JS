Week 1
___________

MongoDB actually stores data as BSON or binary JSON
Mongo drivers send and rcv data as BSONa nd data is stored in mongo as BSON
On app side Mongo drivers map BSON to other data types


BSON is lightweight, traversable and efficient

In JSON there is a single Number type so we can't distinguish bw int and float

JSON does not support dates. We have to encode dates as strings

BSON extends JSON to support these data types and many more

Use Mongo version 3.2.x

db.movies.insertOne({})-> inserts a document in movies collection

db.movies.find() : fetches docs

Mongo uses query by example strategy
As 1st parameter to find() we can pass a doc which matches shape of docs we want to find

db.movies.find({"title":"Jaws"})

Note find() returns a cursor object

var c = db.movies.find()
c.hasNext()
c.next()

Mongodb Nodejs driver
________________


A driver is a library in a specific language, here it is js
It handles a lot of stuff behind the scenes

In app.js:

install mongodb, consolidate, express

see app2.js

Template Library:

Here we will use Nunjucks

Also we include a library called consolidate

consolidate is basically a wrapper for a number of templating engines


Week - 2
_________________________________


CRUD operations in Mongo
________________________


CREATE:

we can specify explicitly which _id to use

db.movieScratch.insertOne({"title": "Rocky", "year": 1976, "_id": "tt0075148"})

here we are using title as the id

insertMany: takes in an array of documents and inserts them in the collection

db.movieScratch.insertMany([
    {
        //data
    },
    {
        //data
    },
    ...
])

return value: array of all ObjectId of docs we inserted

example:

db.moviesScratch.insertMany(
    [
        {
	    "imdb" : "tt0084726",
	    "title" : "Star Trek II: The Wrath of Khan",
	    "year" : 1982,
	    "type" : "movie"
        },
        {
	    "imdb" : "tt0796366",
	    "title" : "Star Trek",
	    "year" : 2009,
	    "type" : "movie"
        },
        {
	    "imdb" : "tt1408101",
	    "title" : "Star Trek Into Darkness",
	    "year" : 2013,
	    "type" : "movie"
        },
        {
	    "imdb" : "tt0117731",
	    "title" : "Star Trek: First Contact",
	    "year" : 1996,
	    "type" : "movie"
        }
    ]
);

Now in many occasions we might have errors while performing these sorts of batch operations
for eg in the above eg if we want to use imdb as id and 2 imdb values are same

db.moviesScratch.insertMany(
    [
        {
	    "imdb" : "tt0084726",
	    "title" : "Star Trek II: The Wrath of Khan",
	    "year" : 1982,
	    "type" : "movie"
        },
        {
	    "imdb" : "tt0796366",
	    "title" : "Star Trek",
	    "year" : 2009,
	    "type" : "movie"
        },
        {
	    "imdb" : "tt0084726",
	    "title" : "Star Trek Into Darkness",
	    "year" : 2013,
	    "type" : "movie"
        },
        {
	    "imdb" : "tt0117731",
	    "title" : "Star Trek: First Contact",
	    "year" : 1996,
	    "type" : "movie"
        }
    ]
);


db.moviesScratch.insertMany(
    [
        {
	    "_id" : "tt0084726",
	    "title" : "Star Trek II: The Wrath of Khan",
	    "year" : 1982,
	    "type" : "movie"
        },
        {
	    "_id" : "tt0796366",
	    "title" : "Star Trek",
	    "year" : 2009,
	    "type" : "movie"
        },
        {
	    "_id" : "tt0084726",
	    "title" : "Star Trek Into Darkness",
	    "year" : 2013,
	    "type" : "movie"
        },
        {
	    "_id" : "tt0117731",
	    "title" : "Star Trek: First Contact",
	    "year" : 1996,
	    "type" : "movie"
        }
    ]
);

Result:

Here 2 docs will be inserted.. Why?

insertMany by default does an ordered insert.. So as soon as error occurs it STOPS
here it inserted 1st 2.. 3rd caused error so it stopped

What if we want our code to keep running and not stop irrespective of the error?

db.moviesScratch.insertMany(
    [
        {
	    "_id" : "tt0084726",
	    "title" : "Star Trek II: The Wrath of Khan",
	    "year" : 1982,
	    "type" : "movie"
        },
        {
	    "_id" : "tt0796366",
	    "title" : "Star Trek",
	    "year" : 2009,
	    "type" : "movie"
        },
        {
	    "_id" : "tt0084726",
	    "title" : "Star Trek Into Darkness",
	    "year" : 2013,
	    "type" : "movie"
        },
        {
	    "_id" : "tt0117731",
	    "title" : "Star Trek: First Contact",
	    "year" : 1996,
	    "type" : "movie"
        }
    ],
    {
        "ordered": false
    }
);

Now 3 writeErrors will occur as we have 3 repetitions now

Apart from insertOne() and insertMany() commands docs may be inserted using UPDATE command
These are called UPSERTS

________________________________

Week 2
_______________________________________

_id:

ObjectId: ----|---|--|---

12 bit hex string
1st: DATE 2nd: MAC ADDR 3rd: PID 4th: COUNTER

READ:

db.movieDetails.find({ rated: "PG-13" }).pretty()
db.movieDetails.find({ rated: "PG-13" }).count()
db.movieDetails.find({ rated: "PG-13", year: 2009 }).count()

{ rated: "PG-13", year: 2009 }: query doc

rated: "PG-13", year: 2009: selectors

selectors in query doc are implicitly ANDed

OR can be achieved as well

db.movieDetails.find({"tomato.meter": 99})

identifies nested field

matching array fields:

db.movieDetails.find({"writers":[
        "John Lasseter",
        "Andrew Stanton",
        "Lee Unkrich",
        "Michael Arndt"
    ]})

Here the writers array should be EXACTLY same as that specified in the query for it to match
ORDER is also Important

db.movieDetails.find({"actors": "Ned Beatty"})

Here ANY element of actor array should be Ned Beatty for it to match

often in documents elements of an array may be explicitly ordered on the basis of importance
eg:
actors: [
"SRK", "Alia Bhatt", "Kunal Kapoor", "Ali Zafar"
]
1st 2 were lead actors while the rest played supporting roles
Here the ORDER of the element is important

We want to find movies in which SRK was the lead actor

db.movieDetails.find({"actors": "SRK"}): wont work

db.movieDetails.find({"actors.0": "SRK"})

Projections:
we kow by default mongo returns all fields in all matching docs
we can limit that by projections
Projections reduce nw overhead and processing requirements

db.movieDetails.find({"actors": "Ned Beatty"}, {"title": 1})
returns:

{
    "_id" : ObjectId("5882eab44b2d00d87758bf34"),
    "title" : "Toy Story 3"
}

Note _id is explicitly returned

if we want to omit title we put title:0


Comparison Operators:

Look for all movies with runtime > 90

db.movieDetails.find({ "runtime": { $gt: 90 } }, {"title": 1}) //projecting out the title


Look for all movies with 120 > runtime > 90

db.movieDetails.find({ "runtime": { $gt: 90, $lt: 120 } })

Look for all movies with 120 >= runtime >= 90

db.movieDetails.find({ "runtime": { $gte: 90, $lte: 120 } })


Find Awesome and long Movies

db.movieDetails.find({ "tomato.meter": { $gt: 95 }, "runtime": { $gt: 180 } })

Not equal: use $ne

db.movieDetails.find({ rated: { $ne: "UNRATED" } });

This finds all docs which have rated field other than UNRATED but also returns docs which DO NOT have
a rated field AT ALL

$in:

db.movieDetails.find({ rated: { $in: ["G", "PG"] } });

Similarly $nin

$exists:

db.movieDetails.find({"director": {$exists: true}})

returns the doc which have director field

$type:

db.moviesScratch.find({ "_id": { $type: "string" } })


Logical Operators:

find movies with tomato rating > 95 OR metacritic rating > 88

db.movieDetails.find({ $or: [ { "tomato.meter": {$gt: 95} }, { "metacritic": {$gt: 88} } ] })


find movies with tomato rating > 95 AND metacritic rating > 88

db.movieDetails.find({ $and: [ { "tomato.meter": {$gt: 95} }, { "metacritic": {$gt: 88} } ] })

However note:

had we done

db.movieDetails.find({ "tomato.meter": {$gt: 95}, "metacritic": {$gt: 88} }): same thing

So why is there an AND operator?

$and allows us to put multiple constraints on SAME field

db.movieDetails.find({ $and: [{ "metacritic": {$ne: null} }, { "metacritic": {$exists: true} }] })

$regex:

Find all docs where awards.text field starts with "Won"

db.movieDetails.find({ "awards.text": { $regex: /^Won\s.*/ } })
\s signifies a space

Array Operators:

$all: Matches array that contains ALL elements specified in the query

db.movieDetails.find({"genres": { $all: ["Comedy", "Animation", "Adventure"] }})

ORDER DOES NOT MATTER

$size: match docs based on length of array

db.movieDetails.find({ "countries": {$size: 1} })

$elemMatch:

Consider addition of one more field

boxOffice: [ { "country": "USA", "revenue": 41.3 },
             { "country": "Australia", "revenue": 2.9 },
             { "country": "UK", "revenue": 10.1 },
             { "country": "Germany", "revenue": 4.3 },
             { "country": "France", "revenue": 3.5 } ]


Now suppose we want to find docs where box office collection from UK is > 15

db.movieDetails.find({ "boxOffice": { "country": "UK", revenue: { $gt: 15 } } })

Here mongo is simply looking for a boxOffice value that satisfies these 2 selectors
Here this doc will be retrieved
Here it matches boxOffice as a WHOLE

$elemMatch requires that all criteria be satisfied within a single element of an array field

db.movieDetails.find({ boxOffice: { $elemMatch: { "country": "UK", "revenue": {$gt: 15} } } })

here ONLY those docs will be returned where the criteria is matched WITHIN an element of the boxOffice array


UPDATING Docs
___________________

There are some situations in which updating can result in creating docs

Syntax: 1st specify selector doc..2nd argument is where we specify HOW we would like to update the doc


updateOne: updates 1st doc that matches our selector

db.movieDetails.updateOne({ title: "The Martian" }, { $set: { poster: "new-link" } })

$set: replaces or adds field specified

$unset: removes field

$inc:

increments a field value

db.movieDetails.updateOne({ title: "The Martian" }, { $inc: {"tomato.reviews": 3, "tomato.userReviews": 25} } })
This inc tomato.reviews by 3 and tomato.userReviews by 25

Array Update Operators:

$addToSet: add elem iff it does not exist
$pop: removes 1st or last elem
$pullAll: removes all matching values
$pull: Removes all array elems that match a specified query
$pushL: add an item

db.movieDetails.updateOne({title: "The Martian"},
                          {$push: { reviews: { rating: 4.5,
                                               date: ISODate("2016-01-12T09:00:00Z"),
                                               reviewer: "Spencer H.",
                                               text: "The Martian could have been a sad drama film,
                                               instead it was a hilarious film with a little bit of drama
                                               added to it. The Martian is what everybody wants from a space
                                               adventure. Ridley Scott can still make great movies and this
                                               is one of his best."} } })


This pushes a new object inside the reviews field

If the field does not exist it will get created automatically.. Note reviews field will be an array field and
the object specified will be pushed to it


$each:

db.movieDetails.updateOne({title: "The Martian"},
                          {$push: { reviews:
                                    { $each: [
                                        { rating: 0.5,
                                          date: ISODate("2016-01-12T07:00:00Z"),
                                          reviewer: "Yabo A.",
                                          text: "i believe its ranked high due to its slogan 'Bring him Home' there is nothing in the movie, nothing at all ! Story telling for fiction story !"},
                                        { rating: 5,
                                          date: ISODate("2016-01-12T09:00:00Z"),
                                          reviewer: "Kristina Z.",
                                          text: "This is a masterpiece. The ending is quite different from the book - the movie provides a resolution whilst a book doesn't."},
                                        { rating: 2.5,
                                          date: ISODate("2015-10-26T04:00:00Z"),
                                          reviewer: "Matthew Samuel",
                                          text: "There have been better movies made about space, and there are elements of the film that are borderline amateur, such as weak dialogue, an uneven tone, and film cliches."},
                                        { rating: 4.5,
                                          date: ISODate("2015-12-13T03:00:00Z"),
                                          reviewer: "Eugene B",
                                          text: "This novel-adaptation is humorous, intelligent and captivating in all its visual-grandeur. The Martian highlights an impeccable Matt Damon, power-stacked ensemble and Ridley Scott's masterful direction, which is back in full form."},
                                        { rating: 4.5,
                                          date: ISODate("2015-10-22T00:00:00Z"),
                                          reviewer: "Jens S",
                                          text: "A declaration of love for the potato, science and the indestructible will to survive. While it clearly is the Matt Damon show (and he is excellent), the supporting cast may be among the strongest seen on film in the last 10 years. An engaging, exciting, funny and beautifully filmed adventure thriller no one should miss."},

                                        { rating: 4.5,
                                          date: ISODate("2016-01-12T09:00:00Z"),
                                          reviewer: "Spencer H.",
                                          text: "The Martian could have been a sad drama film, instead it was a hilarious film with a little bit of drama added to it. The Martian is what everybody wants from a space adventure. Ridley Scott can still make great movies and this is one of his best."} ] } } } )


if we dont us $each a big array will be pushed to reviews like:

reviews:
[
[{}, {}, ....]
]

But $each adds it like:

reviews:
[
{}, {}, {}...
]

$slice:

We want to keep 5 recent reviews only
So every time we get a new review delete oldest one and add new one

db.movieDetails.updateOne({ title: "The Martian" },
                          {$push: { reviews:
                                    { $each: [
                                        { rating: 0.5,
                                          date: ISODate("2016-01-13T07:00:00Z"),
                                          reviewer: "Shannon B.",
                                          text: "Enjoyed watching with my kids!" } ],
                                      $position: 0,
                                      $slice: 5 } } } )



updateMany: updates ALL docs that match

db.movieDetails.updateMany({ rated: null }, { $set: {rated: "UNRATED"} })

OR remove the null rated fields

$unset:

db.movieDetails.updateMany({rated: null}, {$unset: { rated: "" }})

UPSERT: We can create docs using update. if no doc is found matching our filter then we insert new doc

$upsert: true

Suppose we have a detail object in js and we want to add it in db
But we dont want duplicates and if it does not exist we want to create it

db.movieDetails.updateOne({ "imdb.id": detail.imdb.id }, { $set: detail }, { upsert: true })

ReplaceOne:

suppose we have docs in db
But we want to replace them with more detailed docs
the detailed doc is stored in detail object

db.movies.replaceOne({ "imdb": detail.imdb.id }, detail)

it does a whole sale doc replacement
HW
___

1. Decade
2. A and E
3. db.movieDetails.find({"countries.1": "Sweden"}).count() ans: 6
4. db.movieDetails.find({genres: ["Comedy", "Crime"]}).count() ans: 20
5. db.movieDetails.find({"genres": { $all: ["Comedy", "Crime"] }}) ans: 56
6. $set


Week 3
______________

Nodejs Driver
_______________

We have a json file from crunchbase

mongorestore works with a binary dump file
mongoimport on the other hand allows us to import human readable json into a certain db and collection

mongoimport -d crunchbase -c companies companies.json

this command imports 18801 docs

Now we want to use this data set

see week-3/app1.js

var query = {"category_code": "biotech"};

    db.collection('companies').find(query).toArray(function (err, docs) {

        assert.equal(err, null);
        assert.notEqual(docs.length, 0);

        docs.forEach(function (doc) {
            console.log(doc.name + " is a " + doc.category_code + " company");
        });
    });

db.collection('companies').find(query) returns a cursor
toArray() retrieved docs
toArray() caused driver to know that client wants all docs returned in an array




Now we want to use a cursor
see app2.js

var cursor = db.collection("companies").find(query);

// assign cursor to a variable

here we are not pulling in all the data to memory as we did previously

find() does not make a req to db.. It created the cursor only


var cursor = db.collection("companies").find(query);

    // assign cursor to a variable


    // cursor has forEach method
    // note cursor.forEach is not forEach method on arrays as cursor is not an array
    // 1st arg: callback for iterating through the docs
    // 2nd arg: what to do when cursor is exhausted or there is an error

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

Projections:

We only need some of the fields in the collection most of the times

var projection = {"name": 1, "category_code": 1, "_id": 0};

This saves bandwidth as we are projecting out just the fields we need


Query Operators in the nodejs driver:

we want to enter stuff from command line and have node search mongodb accordingly

for eg node app.js -f 2004 -l 2010 -e 100

this searches for docs on companies founded bw 2004 and 2010 and which have min of 100 employess

use package command-line-args

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

>node app3.js -f 2004 -l 2010 -e "1000"

options looks like:

{ firstYear: 2004, lastYear: 2010, employees: 1000 }


see app3.js


$regex in nodejs driver:

we want to build an app that takes in a reg exp on the command line

see app4


Dot notation in nodejs driver:

We want to add in args to query ipo field

We modify app3.js here


// ipo args
if("ipo" in options){
    if(options.ipo == "yes"){
        query["ipo.valuation_amount"] = {"$exists": true, "$ne": null};
    } else if(options.ipo == "no"){
        query["ipo.valuation_amount"] = null;
    }
}

Dot notation on embedded docs in arrays:

each company has an offices field which is an array of objects

We want to kno which compnaies have offices in which countries

See app3.js


Sort, Skip, Limit:

see app5.js

We might want to limit no of docs returned (LIMIT)
We may skip 1st 10 results (SKIP)

SORT:

sort, limit and skip are cursor methods that we can chain on to the cursor as we did with cursor.project()

cursor.sort({founded_year: 1})

1: ASC
-1: DESC

Note .sort() simply adds features or properties to cursor. It ahs not fetched any docs YET
it fetches docs when forEach method is called


When we want to sort on multiple fields we need to use an array not an object as order is imp here
cursor.sort([ ["founded_year", 1], ["number_of_employees", -1] ])

SKIP AND LIMIT:

Skip and Limit are also cursor methods

$ node app5.js -f 2005 -l 2010 -e 500 --limit 10 --skip 0


skip is basically like the offset

Here 1st 10 results are shown

for next 10:

$ node app5.js -f 2005 -l 2010 -e 500 --limit 10 --skip 10

Also note:

We have

cursor.sort([["founded_year", 1], ["number_of_employees", -1]]);
cursor.skip(options.skip);
cursor.limit(options.limit);

The order in which we apply sort, skip and limit DOES NOT MATTER

Mongo always does SORT, then SKIP and then LIMIT


Writing Data: InsertOne and InsertMany:

See app6.js

This uses the twitter npm package and twitter stream API to insert tweets one by one about a certain topic

See app7.js

deleteOne and deleteMany:

In crunchbase db in companies collection:

db.getCollection('companies').find({permalink: "thomson-reuters"}, {name: 1, updated_at:1})

/* 1 */
{
    "_id" : ObjectId("52cdef7d4bab8bd6752996d1"),
    "name" : "Thomson Reuters",
    "updated_at" : "Tue Dec 24 03:32:45 UTC 2013"
}

/* 2 */
{
    "_id" : ObjectId("52cdef7d4bab8bd675299a5b"),
    "name" : "Thomson Reuters",
    "updated_at" : "Tue Dec 24 03:32:45 UTC 2013"
}

We have duplicate data here

We want to eliminate these

see app8

Initially if we try to run the app we get Error:

AssertionError: { MongoError: Executor error during find command: OperationFailed: Sort operation used more than the maximum 33554432 bytes of R == null

Problem is:
cursor.sort({"permalink": 1});

we can sort in db side provided we have set an index that mongo can use to do our sort
boz we dont have such an index set up the system tries to do the sort in memory rather than in the db


Soln:

In Mongo Shell

db.companies.createIndex({permalink: 1})

{
    "createdCollectionAutomatically" : false,
    "numIndexesBefore" : 1,
    "numIndexesAfter" : 2,
    "ok" : 1.0
}

Now we do not get this problem and when we run the app above 900 docs are returned

Repetitions:907

We use deleteOne() to delete them one by one

We run app8 will delete code uncommented

After it runs all get deleted

So now if we run again

Repeated: 0

Problem: there were 907 repetition.. calling deleteOne() on every single one of them requires 907
calls to db. this is very inefficient

Better approach
See app9:

hw:

1: a
2: last
3. 169
4. 48


Week-4
_____________________________________


MongoDB Schema Design:

In relational db schemas its best to follow 3NF form
we can follow the same form in mongo as well

But in Mongo it is very useful to follow Application-driven Schema

Mongo Features:

-> Rich documents: Docs can store an array of docs as well as other doc
-> Pre Join/ Embed data: Mongo DOES NOT support JOIN in the kernel itself. If we wnat to join we will
have to do it on the app logic
-> Joins are costly. So it isbetter to embed related data
-> No constraints: No foreign key concept.
-> Atomic Operations
-> No declared schema

The MOST imp factor in designing application schema is to MATCH data patterns of the app

Relational Normalization:

Posts table of a Blog Project:

Post_id     title       Body        Author      Author_email
1           abc                       mini       mini@pook.com
2           cde                       mini       mini@pook.com
3

This is not 3NF .. this is bcoz if we hv to update email of mini we have to update in both places
If we update in id=1 and not in id=2 data will be inconsistent

3NF: not 3NF as author_email is non key attr but it tells us something about a field(Author) which is not key attr


Goals of Normalization:

-> free db of modification anomalies

-> Minimize redesign when extending db: mongo is very flexible so this is achieved. We can add keys and attr to docs
without changing existing docs

-> Avoid bias towards any particular access pattern: Mongo DOES not follow this. When u are not biased towards
a specific access pattern u are equally bad at all of them. We want to Prune up db for app


Modelling a Blog in MogoDB:


Posts collection

{
    _id: "",
    title: "",
    author: "", <- username or email or both
    content: "",
    comments: [
        {author: "", content: "", date: Date()},
        {author: "", content: "", date: Date()}
    ]
    tags: ["", "", ""],
    date: date()
}

comments is embedded here

Authors collection

{
    _id: "",
    name: "",
    email: "",
    password: ""
}

Living without constraints:

Lets imagine mongo collection in relational form

Posts

{
    _id: 1,
    title: "",
    author: "",
    content: "",
    date: date()
}

Comments

{
    _id: "",
    post_id: 1,
    author: "",
    content: "",
    date: date()
}

Tags

{
    _id: "",
    post_id: 1,
    tag: "",
    date: date()
}

Now post_id in comments collection needs to be a foreign key in relational scheme
Mongo does not support foreign key. So soln is embedding docs


Posts collection

{
    _id: "",
    title: "",
    author: "", <- username or email or both
    content: "",
    comments: [
        {author: "", content: "", date: Date()},
        {author: "", content: "", date: Date()}
    ]
    tags: ["", "", ""],
    date: date()
}


Since comments is embedded into a post we dont need foreign key anyway
We cant have a comment which has no post

Same for tags








































































