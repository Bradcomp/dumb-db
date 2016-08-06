#Dumb DB

This is a datastore for when you just want to store some object to disk.

It makes no guarantees on the integrity of your data.

Use at your own risk.

`npm i dumb-db`

```JavaScript

const db = require('dumb-db');

db.load();

db.set('a', 'hello');
db.set('b', 'world');

db.get('b')  //=> 'world'

db.toObject(); //=> {a: 'hello', b: 'world'}

db.del('a');
db.toObject();  //=> {b: 'world'}
```

You can override the default database location ('./db.json') too!
```JavaScript
db.database = './data/db.json';
```

While it automatically persists your data, you can also call `db.persist()`.
