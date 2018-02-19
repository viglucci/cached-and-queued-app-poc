const redis = require('redis');
const util = require('util');

class Client {
  constructor(Config) {
    this.Config = Config;
    this._client = undefined;
  }

  connect() {
    const config = this.Config.get(`redis`);
    this._client = redis.createClient(config);
    return this;
  }

  get(key) {
    return new Promise((resolve, reject) => {
        return this._client.get(key, (err, value) => {
          if (err) { return reject(err); }
          resolve(value);
        });
    });
  }

  set(key, value) {
    return new Promise((resolve, reject) => {
      return this._client.set(key, value, (err) => {
        if (err) { return reject(err); }
        resolve(value);
      });
    });
  }
}

module.exports = Client;
