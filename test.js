const assert = require('assert');
const db = require('.');

db.set('a', 'hello');
db.set('b', 35);
db.set('stuff', [1,2,3, 'hello', 'banana']);

assert.equal(db.get('b'), 35, 'Can set and get values');
assert.deepEqual(db.get('stuff'), [1,2,3, 'hello', 'banana'], 'Can store arrays');
assert.deepEqual({
    a: 'hello',
    b: 35,
    stuff: [1,2,3, 'hello', 'banana']
}, db.toObject(), 'Can return a clone of the object');
db.del('stuff');
assert(db.get('stuff') === undefined, 'Can delete things');

//Now, we manually clear out the values for testing load.
db._values = {};
db._opLog.then(() => {
  db.load();
  assert.deepEqual(db.toObject(), {a: 'hello', b: 35}, 'can load from disk');
  db.clear();
  assert.deepEqual(db.toObject(), {});
  console.log('Tests passed!');
})

