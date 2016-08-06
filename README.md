#Dumb DB

An in-memory data store that also persists the results to disk.

It's not suitable for multi-threaded environments.  Having two processes
accessing the same file will result in the two simply overwriting each
other, which is probably not what you want.

Use at your own risk.

Goals:
* No external dependencies
* Synchronous methods all around
* Non-blocking JSON persistence
* Eventual consistency

The writes are deterministic, but lag behind the in-memory operations.

```JavaScript

const db = require('dumb-db');

//You should only call this when you first load the database. After that, just
//use get and set.
db.load();

db.set('a', 'hello');
db.set('b', 'world');

db.get('b')  //=> 'world'

db.toObject(); //=> {a: 'hello', b: 'world'}

db.del('a');
db.toObject();  //=> {b: 'world'}

db.clear();
db.toObject() //=> {}
```

You can override the default database location ('./db.json') too!
```JavaScript
db.database = './data/db.json';
```

While it automatically persists your data, you can also call `db.persist()`
manually.
