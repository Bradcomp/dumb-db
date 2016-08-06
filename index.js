'use strict'
const fs = require('fs');

const createDb = fname => fs.writeFile(fname, JSON.stringify({}), err => {
    if (err) throw err;
});

const db = {
  _values: {},
  database: `${__dirname}/db.json`,
  get(key) {
    return this._values[key];
  },
  set(key, value) {
    this._values[key] = value;
    this.persist();
    return value;
  },
  del(key){
    delete this._values[key];
    this.persist();
    return true;
  },
  persist() {
      fs.writeFile(this.database, JSON.stringify(this._values), err => {
          if (err) throw err;
      });
  },
  toObject() {
      //Using Object.assign to create a copy
      return Object.assign({}, this._values);
  },
  load() {
      fs.readFile(this.database, (err, result) => {
          if (err && err.code === 'ENOENT') return createDb(this.database);
          if (err) throw err;

          this._values = JSON.parse(result);
      });
  }
}

module.exports = db;
