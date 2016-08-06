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
  persist() {
      const values = JSON.stringify(this._values);
      this.registerOp(() => new Promise((resolve, reject) => {
          fs.truncate(this.database, 0, () => {
              fs.writeFile(this.database, values, err => {
                  if (err) return reject(err);
                  resolve()
              });
          });
      }));

  },
  toObject() {
      //Using Object.assign to create a copy
      return Object.assign({}, this._values);
  },
  load() {
      this.registerOp(() => new Promise((resolve, reject) => {
          fs.readFile(this.database, (err, result) => {
              if (err && err.code === 'ENOENT') return resolve();
              if (err) return reject(err);
              this._values = JSON.parse(result);
              return resolve();
          });
      }));

  },
  registerOp(p) {
      this._opLog = this._opLog
        .then(p)
        .catch(e => {setTimeout(() => { throw e; }, 0)})
  },
  _opLog: Promise.resolve()
}

module.exports = db;
