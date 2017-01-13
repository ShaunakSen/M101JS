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

















