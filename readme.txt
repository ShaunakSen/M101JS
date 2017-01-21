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

















































