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
-> Pre Join/ Embed data: Mongo DOES NOT support JOIN in the kernel itself. If we want to join we will
have to do it on the app logic
-> Joins are costly. So it is better to embed related data
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

-> Minimize redesign when extending db: mongo is very flexible so this is achieved. We can add keys
and attr to docs without changing existing docs

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

Living without transactions:

Transactions are Atomicity, Consistency, Isolation and Durability (ACID)

Mongo does not support Transactions but it supports ATOMIC ops

This means that when u work on a doc either all the changes will be reflected or none of them will

Using this we can achieve the same features that transactions provide most of the times

we can do this in 3 ways:
1. Restructure: we can restructure our schema to use a single doc and use atomic features that mongo provides
2. Implement locking in sw such as critical section or semaphores. this is how the real apps are made. For eg if
a bank needs to transfer money to another they do not have the same relational db that they can simply open a
transaction
3. Tolerate: In modern web apps it is used. For eg in friends feed its not necessary that ALL the friends should see
the updates simultaneously. So a bit of inconsistency is tolerated

One to One Relations:

each item corresponds to exactly one item
eg: employee-resume
Building-floor plan
patient-medical history

employee-resume schema 1:

employee
{
    _id: 20,
    name: "mini",
    resume: 30
}

resume
{
    _id: 30,
    jobs: [],
    education:[],
    employee:20
}

Note: employee:20 is NOT a foreign key. yes it acts like one here but we have no WAY to guarantee as mongo
does not support this

employee-resume schema 2:

employee
{
    _id: 20,
    name: "mini",
    resume:{
               _id: 30,
               jobs: [],
               education:[]
           }
}


When to chose schema 1 and when to chose 2?
-> frequency of access: employee info is accessed very often but access of resume info is very rare.
So 1st scheme is better

-> size of items: for eg if we are never going to update the employee doc but we are gonna update
resume part then 1 is better. if resume>16mb we cant embed it

-> Atomicity of data: If we can tolerate no inconsistency then we should put both in same doc


One to many relations:

eg: city-person

say NYC has 8 mil people

city{
    name:
    area:
    people: []
}

This wont work as people will be too large

people{
    name:
    city: {
        name: "NY",
        area:
    },
    addr: ""
}


the problem with this design is that since there are multiple people living in NYC
the city {} data is duplicated. so i have to keep city data updated across all 8 mil people
Prone to inconsistencies

Best soln: TRUE LINKING

people{
    name: "pooki",
    city: "NYC"
}

city{
    _id: "NYC"
}

But what if instead of one to many the relationship is one to few?

eg: blog post-comments

here the comments are not so huge in no

here we can embed i.e have an array of comments in each post


Many to many relations:

books-authors
students-teachers

more often this tends to be few-few only
so we can use rich dc structure of mongo

Book-author schema:

although there may be a large no of books and a large no of author, each book only has few authors
and each author has only a few books

Schema design 1:

books
{
    _id:12,
    title: "Harry potter and the chamber of secrets",
    authors: [27]
}

authors
{
    _id: 27,
    name: "JK Rowling",
    books: [12, 22]
}

here books and authors are linked in both directions

Schema design 2:

we can simply embed

authors
{
    _id: 27,
    name: "JK Rowling",
    books: [
        {
            _id:12,
            title: "Harry potter and the chamber of secrets",
        },
        {
            ...
        }
    ]
}

prob: book may be duplicated since a book may have many authors


Students-teachers

suppose we embed student inside teacher doc
this requires that for a student to exist a teacher MUST exist
so if a student is just enrolled he/she might not have any teacher
so this is a problem

Multi key Indexes:

Say we have students-teachers schema

students
{
    _id: 0,
    name: "pooki",
    teachers: [1,7,10,23]
}

teachers{
    _id: 7,
    name: "shona"
}


Queries: find all teachers that a particular student has
OR find all students who have had a particular teacher

1 is easy

2:

students:

/* 1 */
{
    "_id" : 0,
    "name" : "mini",
    "teachers" : [
        0,
        1,
        2,
        3
    ]
}

/* 2 */
{
    "_id" : 1,
    "name" : "shona",
    "teachers" : [
        0,
        1
    ]
}

/* 3 */
{
    "_id" : 2,
    "name" : "saurav",
    "teachers" : [
        1,
        2
    ]
}

/* 4 */
{
    "_id" : 3,
    "name" : "paddy",
    "teachers" : [
        3
    ]
}

teachers:

/* 1 */
{
    "_id" : 0,
    "name" : "AKB"
}

/* 2 */
{
    "_id" : 1,
    "name" : "DM"
}

/* 3 */
{
    "_id" : 2,
    "name" : "AKD"
}

/* 4 */
{
    "_id" : 3,
    "name" : "JH"
}

we want to find students who had AKB and DM as their teachers

db.getCollection('students').find({"teachers": {$all: [0,1]}})


But before this we should add multi key index on the teachers key of students collection as we are searching
by teachers so we should add index to make it more efficient

db.students.ensureIndex({"teachers":1})

db.getCollection('students').find({"teachers": {$all: [0,1]}}).explain() to verify this


Benefits of Embedding data:

-> Improved Read performance: Computers use spinning disks. They have very high latency i.e they
take very long to get to 1st byte(> 1ms). But once they get to 1st byte each addnl byte comes quickly(high bw)
So embedded data is faster

-> One round trip to db: on relational tables multiple calls to db are needed to read data. Same for
writing data

Tress:

How to represent a tree inside a db?

ecommerce categories: Men > Outdoors > Sports > Cricket

product{
_id: 3
name:"SS Cricket bat",
category: 7
}

categories{
_id: 7
name: Cricket,
parent: 5
}

parent: parent category

But prob is to find all parents of the category we have to iteratively query all the parents

alternative: ancestors: [5, 2, 1 ]


Given the following typical document for a e-commerce category hierarchy collection called categories
categories
{
  _id: 34,
  name: "Snorkeling",
  parent_id: 12,
  ancestors: [12, 35, 90]
}

Which query will find all descendants of the snorkeling category?

--> db.categories.find({ancestors: 34})

hw

4.1: 1 & 4
4.2: 2
4.3: E

Week - 5
______________________________________________________________

Storage Engines:

Mongo 3.0 onwards offers pluggable storage engines

Storage engine: It is the interface bw the persistence storage(disk) and db itself(mongodb server)
mongodb server talks to disk through a storage engine

say i write a python app using pyMongo driver which talks to db server using wire protocol

when CRUD is needed it will talk to storage engine which will talk to disk

All the diff structures that hold the docs, indexes and meta data are written to disk by the storage engine

Storage engine might use memory to optimize this process

As disk is slow SE has control of memory and it can decide what to persist to disk and when

Python code -------------> MongoDB Server ------------> SE  <--->(memory)    -----------> Disk

Mongo offers Pluggable SE architecture

The engine determines the performance characteristics

MMAP & WiredTiger(default in 3.2+)

Say we have a bunch of MongoDB servers running in a cluster. SE DOES NOT handle communication bw those servers
i.e if we have diff servers, data might get transferred from server to server to provide fault tolerance
This is not affected by SE

It DOES NOT affect API that db presents to the programmer

So it is same for MMAP and WiredTiger

But performance differs


MMAPv1:

Original SE for Mongo

Uses Mmap system call in order to implement SE

Just do man mmap to see info about this

How does this works?

Mongo puts its docs inside files
To do that it allocates a large say 100gb file on disk

If mongo calls mmap() system call it can map 100gb file into 100gb virtual memory(if comp is 64 bit)

This 100gb VM is page-sized
page size: either 4k or 16k

Os decides which pages are going to be in memory and which have to be fetched from disk

When we read doc, if it hits a page that is in memory:Ok
else fetch it from disk

1. Collection level concurrency: Each collection is its own file
So if 2 diff ops access the same collections nd if they are write ops they need to wait

2. In-place updates: we want to update a doc in-place without having to move it. For this we use Power of 2 sizes
allocation

3. Power of 2 sizes allocation: if we try to create a 3 byte doc we get 4 bytes 3byte doc: 4 bytes.. 7:8, 19:32..
So we can grow the doc a bit as we have some addnl space

Note: Mongo cant control what is there in memory and in disk. OS does that


Wired Tiger:

for many cases it is faster

1. Doc level Concurrency: It is not doc level locking as it is a lock-free implementation.It assumes 2 writes are NOT
going to be to same doc and if they are, one of the writes will occur again. This doc level concurrency is very good
vs collection level as in MMAP

2. Compression of data and indexes
WT itself manages the memory that is used to access a file
file is brought in pages of various sizes
WT decides which blocks to keep in memory and which in disk

So before data is written to disk WT compresses the data. This saves a lot of space
Keys are often repeated in most docs. So lot of scope for compression

3. No in-place updates: It uses append only nature of storing data.
When we update doc, WT marks that the space where the doc was in memory is no longer used and it
allocates space for the doc somewhere else
This can result in writing a lot of data say, if u have a large doc and u update only one item, WT has to write that entire
doc again. But this append only feature that helps it in doc level concurrency

killall mongod
mongod -dbpath WT --storageEngine wiredTiger

WT cant open files created by MMAP

Indexes:

Say we have a collection of a bunch of docs
docs:
{
    name: "",
    hair_color: "",
    DOB: ""
}

These docs may be on disk in arbitrary order

Say we want to find all docs with name Mini

We need to scan EVERY doc in collection there could be millions of docs
This collection scan is DEATH to performance

So we need Index

Say we have an index on name

It is like an ordered list of things

Andrew|Barry|Charlie|......    |Zoey

Each index has pointer to location of doc on disk

So it is very fast to search
Say we have to search for Charlie..we can do this using binary search in logn time

This index is structured as Btree

say we want to query on name and hair_color

Then index: (name, hair_color)

Andrew,Black|Andrew,Red|Barry,Brown|Barry,Red|......    |Zoey,Red

Find all Barrys' with certain hair color -> binary search

But if we want to find all people with red hair - Problem
hair_color is not stored in specific order. So we cant apply binary search here

Thus, if our index is (name, hair_color, DOB)

Name -> OK
Name, hair_color -> Ok
Name, hair_color, DOB ->  OK

But not hair_color alone or DOB alone

In general, if our index is (a,b,c)

a -> Ok
a,b -> Ok
a,b,c -> Ok
c -> NO
c,b -> NO
a,c -> to some extent

Prob with index:

Index slows down the writes
But Reads are much faster
So, if our app only involves writing, we do not need index

Strategy: When u insert a very large amt of data, dont use index.. after all data is inserted add the index

Also we should not add index on all keys as then writes will be very slow and lot of disk space will be used

if we have 10 mil docs and dont use index then each search operation will scan 10 mil docs

Creating Indices:


Let us imagine there is a huge db full of student data as
{
    student_id:"",
    scores: [
        {},
        {}
    ]
    class_id: ""
}

Actually here there are 1 mil students each of whom have taken 10 classes

So there are 10 mil docs

There are no indices

db.students.find({student_id: 5})

takes few secs on a very fast computer

db.students.explain().find({student_id: 5})

it does collection scan and looks at all docs

db.students.findOne({student_id: 5})

This will be faster assuming that docs are arranged more or less in same order as student_id
So once it finds the doc it can quit

Add index:

db.students.createIndex({student_id: 1})

We want the doc to be indexed on student_id ascending

The process of creating the index is slow (around 23s)

this is bcoz we have to scan entire collection, create new data structures and write them all to disk

db.students.find({student_id: 5})

very fast!

db.students.explain().find({student_id: 5})
db.students.explain(true).find({student_id: 5})

here it will tell us the no of docs it looked at
here it will be around 10

so that is awesome!!

compound index: db.students.createIndex({student_id: 1, class_id: -1})
creates an index on student_id,class_id where student_id part is ascending and class_id part is descending


Discovering and deleting Indexes:

db.students.getIndexes()

[
    {
        "v" : 2,
        "key" : {
            "_id" : 1
        },
        "name" : "_id_",
        "ns" : "school.students"
    },
    {
        "v" : 2,
        "key" : {
            "student_id" : 1.0
        },
        "name" : "student_id_1",
        "ns" : "school.students"
    }
]

1st index is on _id

we cant delete this

Also there is index on student_id

db.students.dropIndex({student_id: 1})


Multi key Indexes:
__________________

We can create indexes on arrays as well

{
name: "pooki",
tags: ["dress", "chocolates", "shona"],
location: ["kol", "dgp", "jhs"],
color: "green"
}

we can create an index on tags

it will create an index point on "dress", "chocolates", and "shona"

(tags, color): we can create index on this also

it will create an index point on "dress,green", "chocolates,green", and "shona,green"

Restriction: we cant have 2 items if a compound index where both are arrays

(tags, location) -> wont work

This is bcoz too many index points will have to be created in this place

db.getCollection('foo').insert({a:1, b:2})

db.getCollection('foo').createIndex({a:1,b:1})

At this stage the index on (a,b) is not multi-key

db.foo.insert({a:3, b:[3,5,7]})
Now it becomes multi-key

db.getCollection('foo').find({}).explain()

"indexName" : "a_1_b_1",
"isMultiKey" : true,


db.getCollection('foo').getIndexes()

[
    {
        "v" : 2,
        "key" : {
            "_id" : 1
        },
        "name" : "_id_",
        "ns" : "test.foo"
    },
    {
        "v" : 2,
        "key" : {
            "a" : 1.0,
            "b" : 1.0
        },
        "name" : "a_1_b_1",
        "ns" : "test.foo"
    }
]

let us insert both arrays

db.getCollection('foo').insert({a:[3,4,5], b:[7,8,9]})


cannot index parallel arrays [b] [a]

db.getCollection('foo').insert({a:[3,4,5], b:4})

ok

So we cant have multiple values of compound index as arrays
any one may be an array

Dot Notation and Multi key:

We can use dot notation to add index to sub doc

A doc from students collection:

{
    "_id" : ObjectId("589caba3869beedca3a74e9a"),
    "student_id" : 0.0,
    "scores" : [
        {
            "type" : "exam",
            "score" : 8.04217046318541
        },
        {
            "type" : "quiz",
            "score" : 24.8244121169841
        },
        {
            "type" : "homework",
            "score" : 0.45400469915079
        },
        {
            "type" : "homework",
            "score" : 11.656562423626
        }
    ],
    "class_id" : 346.0
}

db.students.createIndex({"scores.score": 1})

takes around 15-20 mins

db.students.getIndexes()

[
    {
        "_id" : 1
    },
    {
        "scores.score" : 1.0
    }
]

see that there is index on scores.score which is our multi key index

db.students.find({'scores.score': {$gt: 99}}).explain()

"indexName" : "scores.score_1",
"isMultiKey" : true,
"indexBounds" : {
                    "scores.score" : [
                        "(99.0, inf.0]"
                    ]
                }

here the Winning plan includes the scores.score index
and it looked for 99<scores.score<inf

Now we want to find students who have an exam score > 99.8:

db.students.find({'scores': {$elemMatch: {type: 'exam', score: {$gt: 99.8}}}})

6547 records are returned

db.students.find({'scores': {$elemMatch: {type: 'exam', score: {$gt: 99.8}}}}).explain()

Look at the winning plan from bottom-up!

first it searches for scores.score bw 99.8 and inf

in second stage:
"$elemMatch" : {
                "$and" : [
                    {
                        "score" : {
                            "$gt" : 99.8
                        }
                    },
                    {
                        "type" : {
                            "$eq" : "exam"
                        }
                    }
                ]
            }


here we are doing an elemMatch for both conditions ie score > 99.8 AND type: exam

db.students.find({'scores': {$elemMatch: {type: 'exam', score: {$gt: 99.8}}}}).explain("executionStats")

Now we will get the execution stats also!!

"totalDocsExamined" : 26188

This is exactly no of docs with score.score > 99.8

db.students.find({'scores.score': {$gt: 99.8}}).count()

26188

So basically  in db.students.find({'scores': {$elemMatch: {type: 'exam', score: {$gt: 99.8}}}})
we looked for scores.score>99.8
and among those docs returned those in which score.score>99.8 and type is exam

Wrong query to find students who have an exam score > 99.8:

db.students.find({ '$and': [ {'scores.type': 'exam', 'scores.score': { $gt: 99.8 }} ] })

here scores > 99.8 returned bt type is not exam!

look at the explain() output and find how mongo interpreted this query:

db.students.find({ '$and': [ {'scores.type': 'exam', 'scores.score': { $gt: 99.8 }} ] }).explain()

again look at output BOTTOM-UP

first:

"indexBounds" : {
                    "scores.score" : [
                        "(99.8, inf.0]"
                    ]
                }

looks for scores.score > 99.8

next stage:

"scores.type" : {
                    "$eq" : "exam"
                }


this is not right as it returns all docs in which scores.score>99.8 and which have scores.type:"exam"

db.students.find({ '$and': [ {'scores.type': 'exam', 'scores.score': { $gt: 99.8 }} ] }).count()

26188

This is same as:

db.students.find({'scores.score': {$gt: 99.8}}).count()


Unique Indexes:
______________________

we can create unique indexes such that no 2 docs can have same keys

db.getCollection('stuff').insert({'thing': 'apple'})
db.getCollection('stuff').insert({'thing': 'pear'})
db.getCollection('stuff').insert({'thing': 'apple'})


db.getCollection('stuff').createIndex({"thing": 1})

ok..

db.getCollection('stuff').dropIndex({"thing": 1})

But we cannot create a unique index

db.getCollection('stuff').createIndex({"thing": 1}, {unique: true})

{
    "ok" : 0.0,
    "errmsg" : "E11000 duplicate key error collection: test.stuff index: thing_1 dup key: { : \"apple\" }",
    "code" : 11000,
    "codeName" : "DuplicateKey"
}

db.getCollection('stuff').remove({thing: 'apple'}, {justOne: true})

Now we can add in the index:

db.getCollection('stuff').createIndex({"thing": 1}, {unique: true})

{
    "createdCollectionAutomatically" : false,
    "numIndexesBefore" : 1,
    "numIndexesAfter" : 2,
    "ok" : 1.0
}

Now if we add in a duplicate

db.getCollection('stuff').insert({'thing': 'apple'})

E11000 duplicate key error collection: test.stuff index: thing_1 dup key: { : "apple" }

db.getCollection('stuff').getIndexes()

[
    {
        "v" : 2,
        "key" : {
            "_id" : 1
        },
        "name" : "_id_",
        "ns" : "test.stuff"
    },
    {
        "v" : 2,
        "unique" : true,
        "key" : {
            "thing" : 1.0
        },
        "name" : "thing_1",
        "ns" : "test.stuff"
    }
]

it tells that index on thing is unique but it does not say that _id is also unique

but we know that

Sparse Indexes:
_____________________

Used when index key is missing from some of the docs

Consider the collection below:

{a:1, b:2, c:5}
{a:10, b:5, c:10}
{a:13, b:17}
{a:7, b:23}

all a and b and values are unique
unique index on a: ok
unique index on b: ok
unique index on c? last 2 docs both have c value of null and hence it will violate unique constraint

Solution:

specify sparse option while creating index

sparse tells db that it should not include in the index docs which are missing the key

So in the above eg if we index on c, 1st 2 docs will be indexed last 2 wont

Say we have a collection of docs of form:

{
    "_id" : ObjectId("589dcb17edb658de350bd772"),
    "name" : "Shaunak",
    "employee_id" : 1,
    "cell" : NumberLong(9830364704)
}

But some docs do not have cell

Add unique index on employee_id

db.getCollection('employees').createIndex({employee_id:1}, {unique: true})

We also might wanna have unique index on cell ph nos as we want to ensure no 2 employees claim to be carrying
same no

db.getCollection('employees').createIndex({cell:1}, {unique: true})

{
    "ok" : 0.0,
    "errmsg" : "E11000 duplicate key error collection: test.employees index: cell_1 dup key: { : null }",
    "code" : 11000,
    "codeName" : "DuplicateKey"
}

db.getCollection('employees').createIndex({cell:1}, {unique: true, sparse: true})

{
    "createdCollectionAutomatically" : false,
    "numIndexesBefore" : 2,
    "numIndexesAfter" : 3,
    "ok" : 1.0
}

Now if we try to do:

db.getCollection('employees').insert({
    "name" : "test",
    "employee_id" : 8,
    "cell" : 9830364704
})

E11000 duplicate key error collection: test.employees index: cell_1 dup key: { : 9830364704.0 }

db.employees.find().sort({employee_id:-1}).explain()

In winning plan:

"stage" : "IXSCAN",
"indexName" : "employee_id_1"

so it sorts by employee_id index

and uses IXSCAN which is very fast

Now sort on cell:

db.employees.find().sort({cell:1}).explain()

"winningPlan" : {
            "stage" : "SORT",
            "sortPattern" : {
                "cell" : 1.0
            },
            "inputStage" : {
                "stage" : "SORT_KEY_GENERATOR",
                "inputStage" : {
                    "stage" : "COLLSCAN",
                    "direction" : "forward"
                }
            }
        }

"stage" : "COLLSCAN" => it did full collection scan
so it did not use index

this is bcoz the db knows that this is a sparse index and that there are entries missing

if it uses that index for sort it might omit docs
so it uses full collection scan

Note:  db.employees.find().sort({cell:1})

returns

/* 1 */
{
    "_id" : ObjectId("589dcb65edb658de350bd787"),
    "name" : "saurav",
    "employee_id" : 3
}

/* 2 */
{
    "_id" : ObjectId("589dcb97edb658de350bd795"),
    "name" : "bhagu",
    "employee_id" : 5
}

/* 3 */
{
    "_id" : ObjectId("589dcb85edb658de350bd789"),
    "name" : "paddy",
    "employee_id" : 4,
    "cell" : NumberLong(8158856789)
}

/* 4 */
{
    "_id" : ObjectId("589dcb39edb658de350bd77b"),
    "name" : "mini",
    "employee_id" : 2,
    "cell" : NumberLong(8609131604)
}

/* 5 */
{
    "_id" : ObjectId("589dcb17edb658de350bd772"),
    "name" : "Shaunak",
    "employee_id" : 1,
    "cell" : NumberLong(9830364704)
}

so even the docs that dont have cell are returned. No docs omitted. Not possible had db used index


so sparse index cant be used for sorting

adv of sparse index:
1. we do not have entry for every single doc for the key that we wanna index
2. uses less space

Index Creation: Foreground and Background:
__________________________________________

Foreground:

->default
->relatively fast
->blocks all readers and writers in the db.. other dbs we will be able to access

Background:

->relatively slow
->does not blocks readers and writers in the db.. But we can have only one background index creation
at a time. Others have to queue and wait

with MongoDB 2.4 and later, you can create multiple background indexes in parallel even on the same database.

Another strategy:

Create index on diff server than one where we serve queries

Say there are 3 servers: A, B and C working together(MongoDB replica set)

Take C out of set temporarily. Run index creation in foreground on C as it is faster.
During this time use A and B to serve queries
After index creation is done bring C back to set

use school db

drop index scores.score
now recreate the index

while we create the index if we try to access the same db by say
db.students.findOne() we will be blocked

But we can access other db

Now lets create index in background and see

db.students.createIndex({"scores.score": 1}, {background: true})

Now if we do
db.students.findOne()
we still get the data while index is being created


Explain:
______________

->explain is a way to figure out what the db would do if it were to complete the query
->explain can be used from shell or from drivers in our app

prev:
db.foo.find().explain()

db.foo.find() produces a cursor. Then we run explain() on it

Bit in 3.0+:

db.foo.explain().find()

db.foo.explain() returns an explainable object
to that object we may run find, update, aggregate, update and help.
We cant run an insert() on it

we can pass parameters to explain() also


Say we have a big collection of a million docs of form:
{
    _id:"",
    a:1.
    b:2,
    c:3
}

Lets add indexes

Compound index on a,b
db.getCollection('example').createIndex({a:1, b:1})

db.getCollection('example').createIndex({b:1})

var exp = db.example.explain()

exp is an explainable object

exp.help()

Explainable operations
	.aggregate(...) - explain an aggregation operation
	.count(...) - explain a count operation
	.distinct(...) - explain a distinct operation
	.find(...) - get an explainable query
	.findAndModify(...) - explain a findAndModify operation
	.group(...) - explain a group operation
	.remove(...) - explain a remove operation
	.update(...) - explain an update operation
Explainable collection methods
	.getCollection()
	.getVerbosity()
	.setVerbosity(verbosity)


exp.find({a:17, b:55}).sort({b:-1})

we can analyze winning plan to see the indexes used

it also shows the rejected plans

in prev versions of mongo:

db.example.find({a:17, b:55}).sort({b:-1}).explain()


db.example.find({a:17, b:55}).sort({b:-1}) returns a cursor to which we run explain()

why is this not used?

db.example.find({a:17, b:55}).sort({b:-1}).count() does not return a cursor

so we cant run count() on it

but with exp.find({a:17, b:55}).sort({b:-1}).count() we get output

exp.find({c:200})

here it cant use index anymore so it did COLLSCAN

Note: we can still use explain in 2 ways
get explainable obj or run explain() on cursor

var cursor = db.example.find({})
cursor.explain()

Which of the following are valid ways to find out which indices a particular query uses? Check all that apply.

db.example.find().explain()
-> works..returns a cursor..so we can call explain() on it

db.example.remove({a:1,b:2}).explain()
->does NOT work as we do not get back a cursor

db.example.explain().remove({a:1,b:2})

->works as we call remove on an explainable obj


Explain Verbosity:

we have been looking at explain() in queryPlanner mode(default mode)
But there are 2 other modes: executionStats and allPlansExecution mode

executionStats includes queryPlanner mode

allPlansExecution mode includes queryPlanner and executionStats mode

QP tells us what db uses for indexes but does not tell us results of using that index
For that we use ES mode

var exp = db.example.explain("executionStats")

exp.find({a:17, b:55})


we analyze the data received
we have queryPlanner mode which tells us that a_b_1 index is used

executionStats is also included
Important keys:

nReturned: no of docs returned

"nReturned" : 100,
"executionTimeMillis" : 72
"totalKeysExamined" : 100,
"totalDocsExamined" : 100,



look at "executionStages" from bottom up

we can see the no of docs returned (nReturned) from each stage

here we examined 100 keys and got back 100 docs => our index worked really well

But here we were finding a and b and we had an index on a and b.. so it performed so well


> db.example.dropIndex({a:1,b:1})
{ "nIndexesWas" : 3, "ok" : 1 }

exp.find({a:17, b:55})

 "winningPlan" : {
         "stage" : "FETCH",
         "filter" : {
                 "a" : {
                         "$eq" : 17
                 }
         },
         "inputStage" : {
                 "stage" : "IXSCAN",
                 "keyPattern" : {
                         "b" : 1
                 },
                 "indexName" : "b_1",
                 "isMultiKey" : false,
                 "multiKeyPaths" : {
                         "b" : [ ]
                 },
                 "isUnique" : false,
                 "isSparse" : false,
                 "isPartial" : false,
                 "indexVersion" : 2,
                 "direction" : "forward",
                 "indexBounds" : {
                         "b" : [
                                 "[55.0, 55.0]"
                         ]
                 }
         }
 },





"executionSuccess" : true,
"nReturned" : 100,
"executionTimeMillis" : 1155,
"totalKeysExamined" : 10000,
"totalDocsExamined" : 10000,

"executionStats" : {
                "executionSuccess" : true,
                "nReturned" : 100,
                "executionTimeMillis" : 14,
                "totalKeysExamined" : 10000,
                "totalDocsExamined" : 10000,
                "executionStages" : {
                        "stage" : "FETCH",
                        "filter" : {
                                "a" : {
                                        "$eq" : 17
                                }
                        },
                        "nReturned" : 100,
                        "executionTimeMillisEstimate" : 11,
                        "works" : 10001,
                        "advanced" : 100,
                        "needTime" : 9900,
                        "needYield" : 0,
                        "saveState" : 78,
                        "restoreState" : 78,
                        "isEOF" : 1,
                        "invalidates" : 0,
                        "docsExamined" : 10000,
                        "alreadyHasObj" : 0,
                        "inputStage" : {
                                "stage" : "IXSCAN",
                                "nReturned" : 10000,
                                "executionTimeMillisEstimate" : 11,
                                "works" : 10001,
                                "advanced" : 10000,
                                "needTime" : 0,
                                "needYield" : 0,
                                "saveState" : 78,
                                "restoreState" : 78,
                                "isEOF" : 1,
                                "invalidates" : 0,
                                "keyPattern" : {
                                        "b" : 1
                                },
                                "indexName" : "b_1",
                                "isMultiKey" : false,
                                "multiKeyPaths" : {
                                        "b" : [ ]
                                },
                                "isUnique" : false,
                                "isSparse" : false,
                                "isPartial" : false,
                                "indexVersion" : 2,
                                "direction" : "forward",
                                "indexBounds" : {
                                        "b" : [
                                                "[55.0, 55.0]"
                                        ]
                                },
                                "keysExamined" : 10000,
                                "seeks" : 1,
                                "dupsTested" : 0,
                                "dupsDropped" : 0,
                                "seenInvalidated" : 0
                        }
                }
        },


looking at executionStats bottom up:

Innermost doc is 1st stage

"indexName" : "b_1", : ran query using index b

"indexBounds" : {
                    "b" : [
                            "[55.0, 55.0]"
                    ]
            },

"nReturned" : 10000,


In the upper stage the 10000 docs had to be checked for a value of 17

"stage" : "FETCH",
        "filter" : {
                "a" : {
                        "$eq" : 17
                }
        },
        "nReturned" : 100,

From here 100 docs were returned


3rd option: allPlansExecution

> db.example.createIndex({a:1,b:1})


> var exp = db.example.explain("allPlansExecution")

executionStats gives us execution stats for the winning plan
But it does not give us execution stats for other plans

allPlansExecution does this


exp.find({a:17, b:55})

returned allPlansExecution result at: https://api.myjson.com/bins/n1qrt

allPlansExecution is an array


1st plan:

"indexName": "b_1",

so it is considering using b index

Note:

"totalKeysExamined": 101,
"totalDocsExamined": 101,

But we know from prev queries that to complete this query using just the b index we need to look at
10000 docs
So how come here it is just 101??

-> 101 was as many as db needed to see to know this plan was a loser
so db abandoned this plan

2nd plan is the winner


nReturned": 100,
"executionTimeMillisEstimate": 0,
"totalKeysExamined": 100,
"totalDocsExamined": 100,

indexName": "a_1_b_1",

Note:

every query should hit an index
every index should be hit on by at least 1 query
ie index should not be wasted

Covered Queries:
_____________________

Query can be satisfied ENTIRELY by an index
no documents need to be scanned
much faster

We have large coll of numbers like:


> db.numbers.findOne()
{ "_id" : ObjectId("58a0d9c80d7421928b7efa3b"), "i" : 0, "j" : 0, "k" : 0 }


> db.numbers.createIndex({i:1,j:1,k:1})
{
        "createdCollectionAutomatically" : false,
        "numIndexesBefore" : 1,
        "numIndexesAfter" : 2,
        "ok" : 1
}


> db.numbers.find({i:2, j:4}).count()
55

var exp = db.numbers.explain("executionStats");
exp.find({i:2, j:4})


"executionStats" : {
                "executionSuccess" : true,
                "nReturned" : 55,
                "executionTimeMillis" : 96,
                "totalKeysExamined" : 55,
                "totalDocsExamined" : 55,

                ...

                 "indexName" : "i_1_j_1_k_1",
            }


It used i_j_k index but it examined 55 docs
So it is not a covered query

But why did it need to examine in spite of us providing index?
reason: we also asked for _id which was not included in index

exp.find({i:2, j:4}, {_id:0, i:1, j:1, k:1})


"executionStats" : {
                "executionSuccess" : true,
                "nReturned" : 55,
                "executionTimeMillis" : 0,
                "totalKeysExamined" : 55,
                "totalDocsExamined" : 0,

            }


totalDocsExamined: 0 and we use index and we get nReturned > 0 => covered

Interesting thing:

if we do:

exp.find({i:2, j:4}, {_id:0})

 "executionStats" : {
                "executionSuccess" : true,
                "nReturned" : 55,
                "executionTimeMillis" : 0,
                "totalKeysExamined" : 55,
                "totalDocsExamined" : 55,
                }


Why?

we are not specifying what other keys to include
we are simply saying we dont want _id
so mongo needs to inspect the docs as it does not know what other keys(say p, q, r) exist


You would like to perform a covered query on the example collection. You have the following indexes:

{ name : 1, dob : 1 }
{ _id : 1 }
{ hair : 1, name : 1 }
Which of the following is likely to be a covered query? Check all that apply.

a: db.example.find({_id:11}, {_id:0, name:1, dob:1})
b: db.example.find({name: {$in: ["a", "b"]}}, {name:1, hair:1})
c: db.example.find({name: {$in: ["a", "b"]}}, {_id:0, hair:1, name:1})
d: db.example.find({name: {$in: ["a", "b"]}}, {_id:0, dob:1, name: 1})

Ans: only d

Reason:

d: only looks at name and uses { name : 1, dob : 1 } index
c: looks just at name but returned hair and name. Issue is if it looks just at name it uses index { name : 1, dob : 1 }
not { hair : 1, name : 1 } as in the latter name is not in left subset.. Now to get hair it must scan docs

When is an Index Used?:

We will look at how mongo chooses an index


Say we have 5 indexes:
b,c     c,b     d,e     e,f     a,b,c

When mongo receives a query it looks at its shape ie what fields are being searched on and if there is a sort()
based on that sys identifies set of candidate index

Say b,c     c,b     and     a,b,c   are candidate indexes

Then mongo creates 3 query plans for each of these 3 candidates
Then in 3 parallel threads issue the queries using these 3 indexes and see which returns results fastest

Winning query plan is stored in cache for future use for queries of that shape

It will be stored in cache until:

-> threshold no of writes occur: 1000
-> rebuild the index
-> if any index is added/dropped
-> mongod process is restarted


Given collection foo with the following index:

db.foo.createIndex( { a : 1, b : 1, c : 1 } )
Which of the following queries will use the index?

a: db.foo.find({b:3, c:4})
b: db.foo.find({a:3})
c: db.foo.find({c:4}).sort({a:1, b:1})
d: db.foo.find({c:4}).sort({a:-1, b:1})

Ans: b and c

To verify the answer key, and see how each index is used, you can check explain("executionStats").

The overriding principle, though, is that you must use a left-subset (or "prefix") of the index.
For sorting, it must either match the index orientation, or match its reverse orientation,
which you can get when the btree is walked backwards.

Index Sizes:

We should fit Working Set into memory
WS: portion of our data that clients are frequently accessing
Indexes should also fit into WS as in order to look for index if we have to pull it from disk we lose the
performance benefits of having an index in the first place


db.students.stats()



"nindexes" : 1,
    "totalIndexSize" : 29380608,
    "indexSizes" : {
        "_id_" : 29380608
    }


wiredTiger supports prefix compression which allows us to have smaller index
so they take up less space on WS

Index Cardinality:
_____________________

How many index pts are there for each type of index

Regular: for every single key that we put in index there is gonna be an index pt. If there is no key then
there is index point for null entry.. So 1:1 relative to no of docs

Sparse: a doc may miss key being indexed. Its not in index.. as we dont keep null in index
So no of index pts <= no of docs

Multi key: index on array values.. say tags:["", "", "", ""]

So there is an index pt for every single one of the values in tags

no of index pts >> no of docs

it may be significantly greater than no of docs

When doc moves every single index pt needs to be updated
if key is null for a particular index then there is no update that needs to happen
Regular index: yes, 1 index pt needs to be updated

For multikey all indexes need to be updated


Geospatial Indexes:

They allow us to find things based on location ie x, y co-ordinates

Say there are set of stores and a person
we want to find out stores closest to the person

for this our doc needs to have a field with x, y coords

location: [x, y],
type: "Restaurant"

createIndex({"location": "2d", type: 1})

find({location: {$near: [x,y]}})
-> returns in order of inc distance


db.getCollection('places').createIndex({location:"2d", "type": 1})

{
    "createdCollectionAutomatically" : false,
    "numIndexesBefore" : 1,
    "numIndexesAfter" : 2,
    "ok" : 1.0
}

db.getCollection('places').getIndexes()

[
    {
        "v" : 2,
        "key" : {
            "_id" : 1
        },
        "name" : "_id_",
        "ns" : "test.places"
    },
    {
        "v" : 2,
        "key" : {
            "location" : "2d",
            "type" : 1.0
        },
        "name" : "location_2d_type_1",
        "ns" : "test.places"
    }
]


db.getCollection('places').find({location: {$near: [50, 50]}})


/* 1 */
{
    "_id" : ObjectId("58a20877000082725fcd4774"),
    "name" : "momo shop gate 10",
    "type" : "restaurant",
    "location" : [
        40,
        74
    ]
}

/* 2 */
{
    "_id" : ObjectId("58a2088c000082725fcd4781"),
    "name" : "bbq",
    "type" : "restaurant",
    "location" : [
        40.2,
        -74.3
    ]
}

/* 3 */
{
    "_id" : ObjectId("58a208a1000082725fcd4785"),
    "name" : "jhoops",
    "type" : "restaurant",
    "location" : [
        41,
        -75
    ]
}

Note: returns in order of inc dist


Geospatial Spherical:

this uses latitude and longitude

Mongo uses location specification called geojson

"_id" : ObjectId("58a210f2000082725fcd48b3"),
    "name" : "junction mall",
    "location" : {
        "type" : "Point",
        "coordinates" : [
            87.2895322,
            23.538859
        ]
}

Note coordinates ate stored in [long, lat] format

We need index:

db.places_3d.createIndex({"location": "2dsphere"})

{
    "createdCollectionAutomatically" : true,
    "numIndexesBefore" : 1,
    "numIndexesAfter" : 2,
    "ok" : 1.0
}

db.places_3d.getIndexes()

[
    {
        "v" : 2,
        "key" : {
            "_id" : 1
        },
        "name" : "_id_",
        "ns" : "test.places_3d"
    },
    {
        "v" : 2,
        "key" : {
            "location" : "2dsphere"
        },
        "name" : "location_2dsphere",
        "ns" : "test.places_3d",
        "2dsphereIndexVersion" : 3
    }
]


We want closest things from college

db.places_3d.find({
    location: {
            $near: {
                    $geometry: {
                                type: "Point",
                                coordinates: [87.2890669, 23.5500977]
                            },
                            $maxDistance: 11000
                }
        }
    })


Text Indexes:
________________

Full text search index

say we have a very large text in a doc
"myText": "lorem  ipsum........  "

we cant search for a particular word in mongodb.. we need to search on the entire string

we could put all words in an array and use $set to push into array and then search.. but that its very tedious

full text search indexes the doc on every word much like how an array is indexed

/* 1 */
{
    "_id" : ObjectId("58a21a62000082725fcd4b52"),
    "words" : "cat moss granite"
}

/* 2 */
{
    "_id" : ObjectId("58a21a7a000082725fcd4b54"),
    "words" : "dog tree ruby"
}

/* 3 */
{
    "_id" : ObjectId("58a21a8f000082725fcd4b5c"),
    "words" : "dog tree granite"
}

/* 4 */
{
    "_id" : ObjectId("58a21a9c000082725fcd4b5e"),
    "words" : "dog cat granite"
}

/* 5 */
{
    "_id" : ObjectId("58a21ab1000082725fcd4b67"),
    "words" : "ruby cat dog"
}


db.getCollection('dogs').find({"words" : "cat moss granite"})

{
    "_id" : ObjectId("58a21a62000082725fcd4b52"),
    "words" : "cat moss granite"
}

db.getCollection('dogs').find({"words" : "cat moss "})

Fetched 0 record(s) in 1ms


These queries are very specific

add in a text index:

db.getCollection('dogs').createIndex({"words":"text"})

NOTE: text index uses logical OR while searching
so if u search for "mini shona"
all docs containing either or both are returned

db.getCollection('dogs').getIndexes()

[
    {
        "v" : 2,
        "key" : {
            "_id" : 1
        },
        "name" : "_id_",
        "ns" : "test.dogs"
    },
    {
        "v" : 2,
        "key" : {
            "_fts" : "text",
            "_ftsx" : 1
        },
        "name" : "words_text",
        "ns" : "test.dogs",
        "weights" : {
            "words" : 1
        },
        "default_language" : "english",
        "language_override" : "language",
        "textIndexVersion" : 3
    }
]

db.dogs.find({$text: {$search: "dog"}})

/* 1 */
{
    "_id" : ObjectId("58a21a7a000082725fcd4b54"),
    "words" : "dog tree ruby"
}

/* 2 */
{
    "_id" : ObjectId("58a21a8f000082725fcd4b5c"),
    "words" : "dog tree granite"
}

/* 3 */
{
    "_id" : ObjectId("58a21a9c000082725fcd4b5e"),
    "words" : "dog cat granite"
}

/* 4 */
{
    "_id" : ObjectId("58a21ab1000082725fcd4b67"),
    "words" : "ruby cat dog"
}


db.dogs.find({$text: {$search: "GrAnite..."}})


/* 1 */
{
    "_id" : ObjectId("58a21a62000082725fcd4b52"),
    "words" : "cat moss granite"
}

/* 2 */
{
    "_id" : ObjectId("58a21a8f000082725fcd4b5c"),
    "words" : "dog tree granite"
}

/* 3 */
{
    "_id" : ObjectId("58a21a9c000082725fcd4b5e"),
    "words" : "dog cat granite"
}

Capitalization or putting periods make no diff
so it is quite flexible


We can also ge back results in order acc to how good a match mongodb feels it is

db.dogs.find({$text: {$search: "dog granite"}}, {$score: {$meta: "textScore"}}).sort({$score: {$meta: "textScore"}})

/* 1 */
{
    "_id" : ObjectId("58a21a8f000082725fcd4b5c"),
    "words" : "dog tree granite",
    "$score" : 1.33333333333333
}

/* 2 */
{
    "_id" : ObjectId("58a21a9c000082725fcd4b5e"),
    "words" : "dog cat granite",
    "$score" : 1.33333333333333
}

/* 3 */
{
    "_id" : ObjectId("58a21a62000082725fcd4b52"),
    "words" : "cat moss granite",
    "$score" : 0.666666666666667
}

/* 4 */
{
    "_id" : ObjectId("58a21a7a000082725fcd4b54"),
    "words" : "dog tree ruby",
    "$score" : 0.666666666666667
}

/* 5 */
{
    "_id" : ObjectId("58a21ab1000082725fcd4b67"),
    "words" : "ruby cat dog",
    "$score" : 0.666666666666667
}


Efficiency of Index Use:
____________________________

Goal:
RW ops are efficient
Selectivity: Minimize no of records scanned with our index
How are Sorts handled?


students collection:

{
    student_id:"",
    scores: [
        {
            type: "exam",
            score: 70
        }
    ],
    class_id:100,
    final_grade: 80
}



db.students.find({student_id:{$gt:500000}, class_id:54}).sort({student_id:1}).explain("executionstats")


if we run this:

totalKeysExamined: 850000+
executionTime is 2700ms

totalKeysExamined- how many keys within the index mongo walked thru in order to generate result
nReturned: 10000

we had to look at a lot more index keys than we needed to find docs

so index was not very selective

winning plan used compd index on student_id, class_id
losing plan would have used index on class_id  but would have to do in memory SORT
so it failed

now note that student_id:{$gt:500000} represents half collection assuming there are 1 mil students

But class_id:54 has around 500 docs so it is much more selective

db.students.find({student_id:{$gt:500000}, class_id:54}).sort({student_id:1}).hint({class_id:1}).explain("executionstats")


hint(shape/name of index)

totalKeysExamined: 20071
nreturned: 10000

executionTime is 79ms

execution time is also less


Better Index: class_id:1, student_id:1

class_id is prefix which is the most selective part of our query
Generally, as we are building compound indexes, put index on which u will do quality queries first b4 the ones
in which u will do ranged queries

db.students.find({student_id:{$gt:500000}, class_id:54}).sort({final_grade:1}).explain("executionstats")

nReturned = totalKeysExamined = totalDocsExamined

We also have a SORT stage so we are doing in memory sort


used index: class_id:1, student_id:1

To avoid SORT we need to make a trade-off
We need to examine a few more keys


new index: class_id:1, final_grade:1, student_id:1

1st it will very selectively identify records we want by class_id:1
then it will walk the next component of keys all the way thru the index so it pulls out the docs in sorted order
we can eliminate dos that dont match criteria on student_id

execution time is very less  now
but we are needing to scan a few more keys
winning plan does not have a SORT stage

Why was this a better index?

class_id is very selective
final_grade: allows us to walk the index keys in order to get sorted result
student_id: allows us to filter on {student_id:{$gt:500000}


we can also sort in rev direction
db.students.find({student_id:{$gt:500000}, class_id:54}).sort({final_grade:-1}).explain("executionstats")


At about 3:13, Shannon mentions that MongoDB can walk the index backward in order to sort on the final_grade field.
While true given that we are sorting on only this field, if we want to sort on multiple fields,
the direction of each field on which we want to sort in a query must be the same as the direction of each field
specified in the index. So if we want to sort using something like
db.collection.find( { a: 75 } ).sort( { a: 1, b: -1 } ), we must specify the index using the same
directions, e.g., db.collection.createIndex( { a: 1, b: -1 } ).



Logging slow queries:
______________________


Profiling: to debug performance of program
there is a Profiler built in mongodb

mongo automatically logs slow queries(> 100ms) to a log

Profiler:


It will write entries to system.profile for any query that takes longer than some specified period of time

There are 3 levels:

0: off(default)
1: logs the slow queries
2: logs all queries

we may use level 2 to know all queries that db is handling.. more for debugging purposes

mongod --dbpath /usr/local/var/mongodb --profile 1 --slowms 2

log the slow queries above 2 ms

drop indexes on school db

db.students.find({id:1000}) -> slow query

now we look in db.system.profile


db.system.profile.find()

"query" : {
        "find" : "students",
        "filter" : {
            "id" : 1000.0
        }
    }

This is the query we did

"docsExamined" : 3247647,
"nreturned" : 0,
"millis" : 43777,

ts: time stamp of query

db.system.profile.find({millis: {$gt:1}}).sort({ts:1})

db.getProfilingLevel()
1
db.getProfilingStatus()

{
    "was" : 1,
    "slowms" : 2
}

db.setProfilingLevel(1,4)
- level 1 and 4 ms

Turn off:

db.setProfilingLevel(0)


Mongotop:

gives high level view of where mongo is spending its time



Sharding:

splitting



Week -6
_____________________________________________________


Introduction to the Aggregation Framework
_______________________________________________


AF is a set of analytics tools in mongodb that allow us to run various types of reports or analysis on docs in one
or more collections

This is based on a Pipeline

Pipeline:


Collection ------> Stage 1 -------> Stage 2 ------> ... ------> Output

Each stage performs a diff op
each stage takes as ip what the stage before it produced as op

Note we have seen this in explain() in winningPlan

Ip and op for all stages are stream of docs

Each indv stage is a data processing unit

It takes a stream of ip docs, processes each doc one at a time and produces an op stream of docs one at a time
Each stage provides a set of knobs or tunables that we can control to parameterize the stage to perform a
particular task

These tunables typically take the form of operators that we can supply. They modify fields for arithmetic ops, do
some accumulation etc

Often we include same type of stage in a Pipeline

Stage 1 may be an initial filter so that we do not have to pass the entire collection into the pipeline
Then remaining stages may be for processing
Final stage may be again for filtering to obtain suitable op


Familiar Aggregation Operations
_________________________________

-match(FIND)
-project
-sort
-skip
-limit


Why are these stages necessary given that the functionalities are already available in mongo query language?
- we need these stages to support the more complex analytics related functionalities that are associated with AF


Return to crunchbase dataset

db.companies.aggregate([
    {$match: {founded_year: 2004}}
])

- look for all companies where founded_year: 2004

adding a 2nd stage to our pipeline:

db.companies.aggregate([
    {$match: {founded_year: 2004}},
    {$project: {
            _id:0,
            name: 1,
            founded_year:1
        }
    }
])

pipeline is an array of docs as elements

each doc must stipulate a particular stage operator

in above query we have 2 stages: match and project

match is filtering against companies coll and passing on to project stage one at a time all of the docs that match

db.companies.aggregate([
    {$match: {founded_year: 2004}},
    {$limit: 5},
    {$project: {
            _id:0,
            name: 1,
        }
    }
])



/* 1 */
{
    "name" : "Digg"
}

/* 2 */
{
    "name" : "Facebook"
}

/* 3 */
{
    "name" : "AddThis"
}

/* 4 */
{
    "name" : "Veoh"
}

/* 5 */
{
    "name" : "Pando Networks"
}


Note: had we swapped order of limit and project:

db.companies.aggregate([
    {$match: {founded_year: 2004}},
    {$project: {
            _id:0,
            name: 1,
        }
    },
    {$limit: 5}
])

Same result


The diff is we had to run many no of docs thru project stage

So always think about the efficiency of the aggregation pipeline. Try to limit the no of docs to be
passed on to the next stage

Sort stage:

db.companies.aggregate([
    {$match: {founded_year: 2004}},
    {$sort: {name: 1} },
    {$limit: 5},
    {$project: {
            _id:0,
            name: 1,
        }
    }
])

/* 1 */
{
    "name" : "1915 Studios"
}

/* 2 */
{
    "name" : "1Scan"
}

/* 3 */
{
    "name" : "2GeeksinaLab"
}

/* 4 */
{
    "name" : "2GeeksinaLab"
}

/* 5 */
{
    "name" : "2threads"
}


here we sort by name ASC

if here we swap sort and limit

db.companies.aggregate([
    {$match: {founded_year: 2004}},
    {$sort: {name: 1} },
    {$skip: 10},
    {$limit: 5},
    {$project: {
            _id:0,
            name: 1,
        }
    }
])

Diff op:


/* 1 */
{
    "name" : "AddThis"
}

/* 2 */
{
    "name" : "Digg"
}

/* 3 */
{
    "name" : "Facebook"
}

/* 4 */
{
    "name" : "Pando Networks"
}

/* 5 */
{
    "name" : "Veoh"
}

db.companies.aggregate([
    {$match: {founded_year: 2004}},
    {$sort: {name: 1} },
    {$skip: 10},
    {$project: {
            _id:0,
            name: 1,
        }
    },
    {$limit: 5}
])

here we match, sort then skip the 1st 10 and limit and project



Reshaping Documents in $project stages
_________________________________________


Say in the cruchbase data set we want to look for:
all companies where greylock partners participated in some round of funding


"funding_rounds" : [
        {

            "investments" : [
                {
                    "company" : null,
                    "financial_org" : {
                        "name" : "Greylock Partners",
                        "permalink" : "greylock"
                    },
                    "person" : null
                },
                {
                    "company" : null,
                    "financial_org" : {
                        "name" : "Omidyar Network",
                        "permalink" : "omidyar-network"
                    },
                    "person" : null
                }
            ]
        }

]



Query:

db.companies.aggregate([
    {$match: {"funding_rounds.investments.financial_org.permalink": "greylock"}},
    {$project: {
            _id:0,
            name: 1,
            ipo: "$ipo.pub_year",
            valuation: "$ipo.valuation_amount",
            founders: "$funding_rounds.investments.financial_org.permalink"
        }
    }
])


What we are doing:


{$match: {"funding_rounds.investments.financial_org.permalink": "greylock"}}
this matches the data for greylock funding


{$project: {
            _id:0,
            name: 1,
            ipo: "$ipo.pub_year",
            valuation: "$ipo.valuation_amount",
            founders: "$funding_rounds.investments.financial_org.permalink"
        }
}

- here we are promoting some nested fields

ipo: "$ipo.pub_year"

we dive into the nested fields and make them top level fields in our output docs

Sample op:

{
    "name" : "LinkedIn",
    "ipo" : 2011,
    "valuation" : NumberLong(9310000000),
    "founders" : [
        [
            "sequoia-capital"
        ],
        [
            "greylock"
        ]
    ]
}


So we have a lot of power on how to get op docs using $project!!

Next example:

Constructing a new doc from values in our ip doc


db.companies.aggregate([
    {$match: {"funding_rounds.investments.financial_org.permalink": "greylock"}},
    {$project: {
            _id:0,
            name:1,
            founded: {
                    year: "$founded_year",
                    month: "$founded_month",
                    day: "$founded_day"
                }
        }
    }
])


Sample op:

/* 1 */
{
    "name" : "Digg",
    "founded" : {
        "year" : 2004,
        "month" : 10,
        "day" : 11
    }
}

/* 2 */
{
    "name" : "Facebook",
    "founded" : {
        "year" : 2004,
        "month" : 2,
        "day" : 1
    }
}


here we are creating a nested doc from some top level fields

So there is a lot of flexibility on how we can reshape docs using $project


$unwind
______________________


when working with array fields in agg pipelines we often need one or more unwind stages

{
    key1: "value1",
    key2: "value2",
    key3: ["elem1", "elem2", "elem3"]
}

After $unwind on key3:

{
    key1: "value1",
    key2: "value2",
    key3: "elem1"
}

{
    key1: "value1",
    key2: "value2",
    key3: "elem2"
}

{
    key1: "value1",
    key2: "value2",
    key3: "elem3"
}

So each op doc has single value for key3 field, not an array of values


Using this on companies eg:


Query:

db.companies.aggregate([
    {$match: {"funding_rounds.investments.financial_org.permalink": "greylock"}},
    {$project: {
            _id:0,
            name: 1,
            amount: "$funding_rounds.raised_amount"
            year: "$funding_rounds.funded_year"
        }
    }
])


Sample op doc:

{
    "name" : "Digg",
    "amount" : [
        8500000,
        2800000,
        28700000,
        5000000
    ],
    "year" : [
        2006,
        2005,
        2008,
        2011
    ]
}


Notice we have arrays for amount and year as we are accessing values inside funding_rounds which is an array

To fix this we can include a $unwind stage before our $project stage

db.companies.aggregate([
    {$match: {"funding_rounds.investments.financial_org.permalink": "greylock"}},
    {$unwind: "$funding_rounds"},
    {$project: {
            _id:0,
            name: 1,
            amount: "$funding_rounds.raised_amount",
            year: "$funding_rounds.funded_year"
        }
    }
])


Now op for the company Digg:

/* 1 */
{
    "name" : "Digg",
    "amount" : 8500000,
    "year" : 2006
}

/* 2 */
{
    "name" : "Digg",
    "amount" : 2800000,
    "year" : 2005
}

/* 3 */
{
    "name" : "Digg",
    "amount" : 28700000,
    "year" : 2008
}

/* 4 */
{
    "name" : "Digg",
    "amount" : 5000000,
    "year" : 2011
}



now we get an amt and year for each funding round of each company in our coll

So all docs where funder is greylock is split into no of docs equal to no of funding rounds that match the filter
and each one of those resulting docs is passed on to project stage

So a company that has 4 funding rounds will result in unwind creating 4 docs where every field is same but
funding_round field will be diff.. instead of being an array it will be an indv element from funding_round array

So op to next stage will be more docs than what unwind received as ip


Now suppose we want to add in a funder field to our op doc


db.companies.aggregate([
    {$match: {"funding_rounds.investments.financial_org.permalink": "greylock"}},
    {$unwind: "$funding_rounds"},
    {$project: {
            _id:0,
            name: 1,
            funder: "$funding_rounds.investments.financial_org.permalink",
            amount: "$funding_rounds.raised_amount",
            year: "$funding_rounds.funded_year"
        }
    }
])



Actually here we are simply projecting out the permalink as a new field called funder

Note that this is kind of like a check to see if our match is working properly
so it is good practice to include this

/* 1 */
{
    "name" : "Digg",
    "funder" : [
        "greylock",
        "omidyar-network"
    ],
    "amount" : 8500000,
    "year" : 2006
}

/* 2 */
{
    "name" : "Digg",
    "funder" : [
        "greylock",
        "omidyar-network",
        "floodgate",
        "sv-angel"
    ],
    "amount" : 2800000,
    "year" : 2005
}

/* 3 */
{
    "name" : "Digg",
    "funder" : [
        "highland-capital-partners",
        "greylock",
        "omidyar-network",
        "svb-financial-group"
    ],
    "amount" : 28700000,
    "year" : 2008
}

/* 4 */
{
    "name" : "Digg",
    "funder" : [],
    "amount" : 5000000,
    "year" : 2011
}

Note : investments field is an array as multiple funders can participate in each funding round

Note however one of the op docs is:

{
    "name" : "Farecast",
    "funder" : [
        "madrona-venture-group",
        "wrf-capital"
    ],
    "amount" : 1500000,
    "year" : 2004
}

So we are seeing a funding round for Farecast in which greylock did not participate


This is bcoz in $match we are simply looking for companies that have any funding round that greylock participated in


But we want to see only funding rounds that greylock participated in


Soln 1:



db.companies.aggregate([
    {$unwind: "$funding_rounds"},
    {$match: {"funding_rounds.investments.financial_org.permalink": "greylock"}},
    {$project: {
            _id:0,
            name: 1,
            funder: "$funding_rounds.investments.financial_org.permalink",
            amount: "$funding_rounds.raised_amount",
            year: "$funding_rounds.funded_year"
        }
    }
])


Now for farecast op:

{
    "name" : "Farecast",
    "funder" : [
        "greylock",
        "madrona-venture-group",
        "wrf-capital"
    ],
    "amount" : 7000000,
    "year" : 2005
}

/* 8 */
{
    "name" : "Farecast",
    "funder" : [
        "greylock",
        "madrona-venture-group",
        "par-capital-management",
        "pinnacle-ventures",
        "sutter-hill-ventures",
        "wrf-capital"
    ],
    "amount" : 12100000,
    "year" : 2007
}

To make op a bit cleaner we can include second unwind so that each investment is broken up:

db.companies.aggregate([
    {$unwind: "$funding_rounds"},
    {$unwind: "$funding_rounds.investments"},
    {$match: {"funding_rounds.investments.financial_org.permalink": "greylock"}},
    {$project: {
            _id:0,
            name: 1,
            funder: "$funding_rounds.investments.financial_org.permalink",
            amount: "$funding_rounds.raised_amount",
            year: "$funding_rounds.funded_year"
        }
    }
])

{
    "name" : "Farecast",
    "funder" : "greylock",
    "amount" : 7000000,
    "year" : 2005
}

/* 8 */
{
    "name" : "Farecast",
    "funder" : "greylock",
    "amount" : 12100000,
    "year" : 2007
}

But note that the 1st 2 unwinds actually run thru the entire collection

We want our match op to occur as soon as possible so that at each stage we are working with fewer docs


Soln2:

db.companies.aggregate([
    {$match: {"funding_rounds.investments.financial_org.permalink": "greylock"}},
    {$unwind: "$funding_rounds"},
    {$unwind: "$funding_rounds.investments"},
    {$match: {"funding_rounds.investments.financial_org.permalink": "greylock"}},
    {$project: {
            _id:0,
            name: 1,
            funder: "$funding_rounds.investments.financial_org.permalink",
            amount: "$funding_rounds.raised_amount",
            year: "$funding_rounds.funded_year"
        }
    }
])

op:


{
    "name" : "Farecast",
    "funder" : "greylock",
    "amount" : 7000000,
    "year" : 2005
}

/* 8 */
{
    "name" : "Farecast",
    "funder" : "greylock",
    "amount" : 12100000,
    "year" : 2007
}



Array Expressions
____________________

We will look at how to use array expressions in project stages

$filter: Selects subset of elements in array based on filter criteria that will be passed to next stage


db.companies.aggregate([
    {$match: {"funding_rounds.investments.financial_org.permalink": "greylock"}},
    {$project: {
            _id: 0,
            name: 1,
            founded_year: 1,
            rounds: {
                    $filter: {
                            input: "$funding_rounds",
                            as: "round",
                            cond: {$gte: ["$$round.raised_amount", 10000000]}
                        }
                }
        }},
    {$match: {"rounds.investments.financial_org.permalink": "greylock"}}
])


Look at the rounds field..

What we are doing is using filter
filter needs 3 params

input: array.. we can provide array literals also
here we are using funding_rounds array

as: name we like to use for funding_rounds array throughout rest of our filter expression

cond: used to select subset of elements of array

$$: var within expression we are working in. as clause defines var round.. $$ uses this

What docs will be produced at end of $project?

we will have docs having name, funded_year and rounds field

rounds will be array comprising elements that match condn


$arrayElemAt:

we want to simply pull out 1st and last round

db.companies.aggregate([
    {$match: {"founded_year": 2010}},
    {$project: {
            _id: 0,
            name: 1,
            founded_year: 1,
            first_round: { $arrayElemAt: ["$funding_rounds", 0] },
            last_round: { $arrayElemAt: ["$funding_rounds", -1] }
        }}
])


We specify an array as value for $arrayElemAt operator
1st elem: array that $arrayElemAt should work with
2nd elem: index that we wouldlike to see

Now we might not know how many elems there are in array

-1: last elem
-2: 2nd last
...

sample op:

{
    "name" : "Needium",
    "founded_year" : 2010,
    "first_round" : {
        "id" : 926,
        "round_code" : "seed",
        "source_url" : "http://www.praized.com/blog/about/web-20-startup-praized-media-inc-secures-1000000-in-seed-funding/",
        "source_description" : null,
        "raised_amount" : 1000000,
        "raised_currency_code" : "USD",
        "funded_year" : 2007,
        "funded_month" : 9,
        "funded_day" : 1,
        "investments" : [
            {
                "company" : null,
                "financial_org" : {
                    "name" : "Garage Technology Ventures Canada",
                    "permalink" : "garage-technology-ventures-canada"
                },
                "person" : null
            }
        ]
    },
    "last_round" : {
        "id" : 926,
        "round_code" : "seed",
        "source_url" : "http://www.praized.com/blog/about/web-20-startup-praized-media-inc-secures-1000000-in-seed-funding/",
        "source_description" : null,
        "raised_amount" : 1000000,
        "raised_currency_code" : "USD",
        "funded_year" : 2007,
        "funded_month" : 9,
        "funded_day" : 1,
        "investments" : [
            {
                "company" : null,
                "financial_org" : {
                    "name" : "Garage Technology Ventures Canada",
                    "permalink" : "garage-technology-ventures-canada"
                },
                "person" : null
            }
        ]
    }
}


$slice: it returns multiple elems from array in sequence beginning with a particular index

db.companies.aggregate([
    {$match: {"founded_year": 2010}},
    {$project: {
            _id: 0,
            name: 1,
            founded_year: 1,
            early_rounds: { $slice: ["$funding_rounds", 1, 3] }
        }}
])


early_rounds will contain items of index 1 and the next 3 elements from the array

so we skip the first one and get the next 3

We can use slice to do the same thing as $elemAt

db.companies.aggregate([
    {$match: {"founded_year": 2010}},
    {$project: {
            _id: 0,
            name: 1,
            founded_year: 1,
            first_round: { $slice: ["$funding_rounds", 1] },
            last_round: { $slice: ["$funding_rounds", -1] }
        }}
])


Instead of 3 elems to $slice we are specifying just 2


$size:

returns size of array

db.companies.aggregate([
    {$match: {"founded_year": 2010}},
    {$project: {
            _id: 0,
            name: 1,
            founded_year: 1,
            total_rounds: { $size: "$funding_rounds" }
        }}
])

Sample op:

{
    "name" : "GENWI",
    "founded_year" : 2010,
    "total_rounds" : 3
}

/* 2 */
{
    "name" : "Needium",
    "founded_year" : 2010,
    "total_rounds" : 1
}


-- for more info on array expressions check out the documentation


Accumulators
____________________________

They are types of expressions only but one that we think of in their own class coz accumulators involve
calculating values from fields of multiple docs

$sum , $avg
$first, $last: 1st and last values in array
$max, $min
$push, $addToSet

prior to mongodb 3.2 accumulators were only available in the $group stage
But now we can access a subset of accumulators in the $project stage as well

diff: acc in project stages must operate on arrays within single doc and in group stage they can act on values across
multiple docs

Using accumulators in project stages:


db.companies.aggregate([
    {$match: {"funding_rounds": {$exists: true, $ne: []}}},
    {$project: {
            _id: 0,
            name: 1,
            largest_round: { $max: "$funding_rounds.raised_amount" }
        }}
])


Sample op:

/* 1 */
{
    "name" : "Wetpaint",
    "largest_round" : 25000000
}

/* 2 */
{
    "name" : "Digg",
    "largest_round" : 28700000
}

/* 3 */
{
    "name" : "Facebook",
    "largest_round" : 1500000000
}

funding_round is an array and raised_amount is found in multiple elements of that array,
$funding_rounds.raised_amount evaluates to an array

$max finds max from that array


db.companies.aggregate([
    {$match: {"funding_rounds": {$exists: true, $ne: []}}},
    {$project: {
            _id: 0,
            name: 1,
            total_fundings: {$sum: "$funding_rounds.raised_amount"}
        }}
])


/* 1 */
{
    "name" : "Wetpaint",
    "total_fundings" : 39750000
}

/* 2 */
{
    "name" : "Digg",
    "total_fundings" : 45000000
}

/* 3 */
{
    "name" : "Facebook",
    "total_fundings" : NumberLong(2425700000)
}


Introduction to $group
_____________________________


$group is similar to SQL GROUP BY

In $group stage we can aggregate together values from multiple docs and perform some type of aggregate
operation on them like calculating average


db.companies.aggregate([
    { $group: {
            _id: { founded_year: "$founded_year" },
            average_number_of_employees: { $avg: "$number_of_employees" }
        } },
    { $sort: { average_number_of_employees: -1 } }
])


Sample op:

/* 1 */
{
    "_id" : {
        "founded_year" : 1847
    },
    "average_number_of_employees" : 405000.0
}

/* 2 */
{
    "_id" : {
        "founded_year" : 1896
    },
    "average_number_of_employees" : 388000.0
}

/* 3 */
{
    "_id" : {
        "founded_year" : 1933
    },
    "average_number_of_employees" : 320000.0
}

/* 4 */
{
    "_id" : {
        "founded_year" : 1915
    },
    "average_number_of_employees" : 186000.0
}

/* 5 */
{
    "_id" : {
        "founded_year" : 1903
    },
    "average_number_of_employees" : 171000.0
}


here we are aggregating all companies based on year in which it was founded

Fundamental to the $group stage is the _id field
_id is how we tune what the group stage uses to organize the docs


$group is 1st stage so all docs are passed to it
The stage will take all docs that have same value for founded_year and treat them as the same group


average_number_of_employees: { $avg: "$number_of_employees" }:  Calculates ave of no of employees for all docs
with same founded_year

We can see from the data that most companies with large no of employees are quite old

But there is one deviation that we notice:

{ "_id" : { "founded_year" : 2001 }, "average_number_of_employees" : 1271.5280898876404 }


To analyze this further

db.companies.aggregate([
    { $match: {founded_year: 2001} },
    { $project: {_id:0, name:1, number_of_employees:1}} ,
    {$sort: {number_of_employees: -1}}
])


{ "name" : "Accenture", "number_of_employees" : 205000 }
{ "name" : "MetaCarta", "number_of_employees" : 99999 }
{ "name" : "Liberty League International", "number_of_employees" : 8000 }
{ "name" : "Sogeti USA", "number_of_employees" : 2500 }
{ "name" : "AppLabs", "number_of_employees" : 2000 }
{ "name" : "Vonage", "number_of_employees" : 1500 }
{ "name" : "SuccessFactors", "number_of_employees" : 1200 }
{ "name" : "SK Net Service Company Ltd", "number_of_employees" : 1000 }
{ "name" : "Sitecore", "number_of_employees" : 600 }
{ "name" : "Acquity Group", "number_of_employees" : 500 }
{ "name" : "Clear2Pay", "number_of_employees" : 450 }
{ "name" : "Rally Software", "number_of_employees" : 430 }
{ "name" : "RigNet", "number_of_employees" : 410 }
{ "name" : "Telogis", "number_of_employees" : 400 }
{ "name" : "AtTask", "number_of_employees" : 350 }
{ "name" : "Infusionsoft", "number_of_employees" : 350 }
{ "name" : "Tobii Technology", "number_of_employees" : 350 }
{ "name" : "ChannelAdvisor", "number_of_employees" : 300 }
{ "name" : "Skyscanner", "number_of_employees" : 300 }
{ "name" : "Propertyware", "number_of_employees" : 300 }


So we can see bcoz of Accenture and MetaCarta this ave is so much



Now we want to see people who have been associated with a large no of companies

There is a relationships field that helps us do this

Sample doc:

{
    "_id" : ObjectId("52cdef7c4bab8bd675297d8a"),
    "name" : "Wetpaint",
    "relationships" : [
        {
            "is_past" : false,
            "title" : "Co-Founder and VP, Social and Audience Development",
            "person" : {
                "first_name" : "Michael",
                "last_name" : "Howell",
                "permalink" : "michael-howell"
            }
        },
        {
            "is_past" : false,
            "title" : "Co-Founder/CEO/Board of Directors",
            "person" : {
                "first_name" : "Ben",
                "last_name" : "Elowitz",
                "permalink" : "ben-elowitz"
            }
        }
    ]
}

Query:

db.companies.aggregate([
    { $match: {"relationships.person": {$ne: null}} },
    { $project: { relationships:1, _id: 0 } },
    { $unwind: "$relationships" },
    { $group: { _id: "$relationships.person", count: { $sum:1 } } },
    { $sort: { count: -1 } }
])


we are matching where relationships.person is not null
then we project out relationships
then we unwind relationships so that every relationship in relationships array comes through to next stage
as a separate doc
group: we use person to aggregate. here we are not using $avg accumulator.. we are using $sum accumulator
then we sort

Sample op:

/* 1 */
{
    "_id" : {
        "first_name" : "Tim",
        "last_name" : "Hanlon",
        "permalink" : "tim-hanlon"
    },
    "count" : 28.0
}

/* 2 */
{
    "_id" : {
        "first_name" : "David S.",
        "last_name" : "Rose",
        "permalink" : "david-s-rose"
    },
    "count" : 24.0
}

Acc to results Tim hanlon has been associated with 28 companies
But this is not really true.. why?

our query was:
db.companies.aggregate([
    { $match: {"relationships.person": {$ne: null}} },
    { $project: { relationships:1, _id: 0 } },
    { $unwind: "$relationships" },
    { $group: { _id: "$relationships.person", count: { $sum:1 } } },
    { $sort: { count: -1 } }
])

Tim hanlon appeared in 28 docs that were passed to the $group stage - we know this

But what docs were passed through to this group stage?
They were all relationships for all companies in our collection

But individuals may appear more than once in relationships in a single company
Tim hanlon may be CFO of company Facebook but he might also have been CTO of facebook earlier

Note in doc there is a field is_past for this

So Tim hanlon occurs 28 times in relationship docs throughout the companies in our collection

We cant say by this query how many unique companies he was associated with


_id in Group Stages
_____________________________


We want a list of companies grouped by founded_year where founded_year > 2010

db.companies.aggregate([
    { $match: { founded_year: { $gte: 2010 } } },
    { $group: { _id: { founded_year: "$founded_year" }, companies: { $push: "$name" } } },
    { $sort: {  "_id.founded_year": 1  } }
])


Sample op:

{
    "_id" : {
        "founded_year" : 2013
    },
    "companies" : [
        "Fixya",
        "Wamba",
        "Advaliant",
        "Fluc",
        "iBazar",
        "Gimigo",
        "SEOGroup",
        "Clowdy",
        "WhosCall",
        "Pikk",
        "Tongxue",
        "Shopseen",
        "VistaGen Therapeutics"
    ]
}


Here we used _id as :
{ _id: { founded_year: "$founded_year" }

Had we simply used _id: "$founded_year"

db.companies.aggregate([
    { $match: { founded_year: { $gte: 2010 } } },
    { $group: { _id: "$founded_year", companies: { $push: "$name" } } },
    { $sort: {  "_id": 1  } }
])



Now op:

{
    "_id" : 2013,
    "companies" : [
        "Fixya",
        "Wamba",
        "Advaliant",
        "Fluc",
        "iBazar",
        "Gimigo",
        "SEOGroup",
        "Clowdy",
        "WhosCall",
        "Pikk",
        "Tongxue",
        "Shopseen",
        "VistaGen Therapeutics"
    ]
}


Note changes in query as well in op doc structure for _id

Note now in op doc "_id" : 2013
so it is not really specific what _id actually means so there nay be confusion

So it is better to make _id a doc rather than a single value

Another eg:

We may want to group based on multiple fields say founded_year and category_code


db.companies.aggregate([
    { $match: { founded_year: { $gte: 2010 } } },
    { $group: { _id: { founded_year: "$founded_year", category_code: "$category_code" }, companies: { $push: "$name" } } },
    { $sort: {  "_id.founded_year": 1  } }
])

Sample op:

{
    "_id" : {
        "founded_year" : 2013,
        "category_code" : "mobile"
    },
    "companies" : [
        "WhosCall"
    ]
}

/* 50 */
{
    "_id" : {
        "founded_year" : 2013,
        "category_code" : "analytics"
    },
    "companies" : [
        "Gimigo"
    ]
}


Group docs based on year in which they did ipo

Now ipo field looks like:

 "ipo" : {
        "valuation_amount" : null,
        "valuation_currency_code" : "USD",
        "pub_year" : 1998,
        "pub_month" : 10,
        "pub_day" : 2,
        "stock_symbol" : "NASDAQ:EBAY"
}


Query:


db.companies.aggregate([
    { $group: {
            _id: { ipo_year: "$ipo.pub_year" },
            compamies: { $push: "$name" }
        } },
    { $sort: { "_id.ipo_year": 1 } }
])


Sample op:

{
    "_id" : {
        "ipo_year" : 1993
    },
    "compamies" : [
        "IAC",
        "Intuit",
        "Alcatel-Lucent",
        "Simon Property Group",
        "Microchip Technologies",
        "Cree"
    ]
}

Note: here we are also using $push
$push: As the group stage sees addnl values, $push adds these values to a running array



$group vs $project
____________________


Some accumulators are available in group stage but not in project


Example:

Query:

db.companies.aggregate([
    {$match: { funding_rounds: {$ne: []} }},
    {$unwind: "$funding_rounds"},
    {$sort: {
            "funding_rounds.funded_year": 1,
            "funding_rounds.funded_month": 1,
            "funding_rounds.funded_day": 1
        }},
    {$group: {
            _id: {company: "$name"},
            funding: {
                    $push: {
                            amount: "$funding_rounds.raised_amount",
                            year: "$funding_rounds.funded_year"
                        }
                }
        }}
])

What we are doing: we are doing a match on fundin_rounds
we unwind funding_rounds so we will get one doc for each elem of funding_rounds array for every company
then we sort funding_rounds in ASC order
then we group the funding_rounds by name.. Since the op is already sorted we get a sorted array of funding_rounds
of every company. We are using $push to build this array


Sample op:


{
        "_id" : {
                "company" : "Birst"
        },
        "funding" : [
                {
                        "amount" : 26000000,
                        "year" : 2012
                },
                {
                        "amount" : 38000000,
                        "year" : 2013
                }
        ]
}


For companies with multiple funding rounds we are seeing a funding array containing amt and year in sorted order

here we are pushing docs built on raised_amount and funded_year

now $push is available in group but not in project stages
Why?group stages are designed to take a sequence of docs and accumulate values based on that stream of docs

$project works with one doc at a time.. so we can calculate ave on an array within a doc in project
But here we are seeing docs and pushing on a value .. this cant be done in project

Another eg:

db.companies.aggregate([
    {$match: { funding_rounds: {$ne: []} }},
    {$unwind: "$funding_rounds"},
    {$sort: {
            "funding_rounds.funded_year": 1,
            "funding_rounds.funded_month": 1,
            "funding_rounds.funded_day": 1
        }},
    {$group: {
            _id: {company: "$name"},
            first_round: {$first: "$funding_rounds"},
            last_round: {$last: "$funding_rounds"},
            num_rounds: {$sum:1},
            total_raised: {$sum: "$funding_rounds.raised_amount"}
        }},
    {$project: {
            company: "$_id.company",
            first_round: {
                    amount: "$first_round.raised_amount",
                    article: "$first_round.source_url",
                    year: "$first_round.funded_year"
                },
            last_round: {
                    amount: "$last_round.raised_amount",
                    article: "$last_round.source_url",
                    year: "$last_round.funded_year"
                },
            num_rounds: 1,
            total_raised: 1
        }},
    {$sort: {total_raised: -1}}
])



This looks very complex but is not so..
Let us work through it

$first and $last: takes 1st and last values and makes it the value of the key it is associated to
As with $push we cant use $first and $last in project stages bcoz project stages are not designed to accumulate
values based on multiple docs streaming through them. They reshape docs only

num_rounds: {$sum:1}: count no of docs that are grouped under given _id value.. here we are
counting by 1 but we can count by nay no

The project stage is quite complex.. But we are simply making op cleaner

Here we are creating a summary


Sample op doc:

{
    "_id" : {
        "company" : "Clearwire"
    },
    "first_round" : {
        "amount" : NumberLong(3200000000),
        "article" : "http://www.techcrunch.com/2008/05/06/32-billion-wimax-deal-goes-through-take-cover/",
        "year" : 2008
    },
    "last_round" : {
        "amount" : 80000000,
        "article" : "http://venturebeat.com/2013/02/27/clearwire-sprint-80m-dish/",
        "year" : 2013
    },
    "num_rounds" : 4.0,
    "total_raised" : NumberLong(5700000000),
    "company" : "Clearwire"
}



















