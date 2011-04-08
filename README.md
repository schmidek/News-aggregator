## Info

A reddit-like news aggregator served directly from CouchDB.

It has almost no features, looks like crap and probably has lots of bugs/security vulnerabilites but if you still want to see it in action [here's a link.](http://news.schmidek.ca)

This is really just an excuse for me to experiment with and learn a bit about CouchDB and to see if CouchDB is even suited for a site like this.

Ranking algorithms used are similar to reddit's hot ranking for posts and best ranking for comments.
[A good summary of how reddit's ranking works.](http://amix.dk/blog/post/19588)

## Deploying this app

Assuming you just cloned this app from git, and you have changed into the app directory in your terminal, you want to push it to your CouchDB with the CouchApp command line tool, like this:

    couchapp push http://name:password@hostname:5984/mydatabase
