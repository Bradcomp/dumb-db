'use strict'
const fs = require('fs');

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
  toObject() {
      //Using Object.assign to create a copy
      return Object.assign({}, this._values);
  },
  clear() {
     this._values = {};
     this.persist();
     return true;
  },
  persist() {
      const values = JSON.stringify(this._values);
      this.registerOp(() => new Promise((resolve, reject) => {
          fs.writeFile(this.database, values, err => {
              if (err) return reject(err);
              resolve();
          });
      }));

  },
  load() {
      //Load uses readFileSync to ensure that, once loaded, the
      //Results are immediately avaliable.
      try {
          const data = fs.readFileSync(this.database);
          this._values = JSON.parse(data);
      }  catch (e) {
          if (e.code !== 'ENOENT') throw e;
      }
  },
  registerOp(p) {
      this._opLog = this._opLog
        .then(p)
        .catch(e => {setTimeout(() => { throw e; }, 0)})
  },
  _opLog: Promise.resolve()
}

module.exports = db;
