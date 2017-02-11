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

It DOES NOT affect API that db presents to thr programmer

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
When we update doc, WT marks that the space where the doc was in memory is no longer used and ii
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

db.students.find({'scores': {$elemMatch: {type: 'exam', score: {$gt: 99.8}}}}).explain()

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
During this time use A and B to server queries
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

















































































































































































































































