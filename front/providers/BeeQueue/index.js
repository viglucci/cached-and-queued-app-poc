const BeeQueue = require('bee-queue');

class Queue {
  constructor(Config) {
    this.Config = Config;
    this._queuesMap = {};
  }

  get(name) {
    if (!this._queuesMap[name]) {
      const config = this.Config.get(`queue.${name}`);
      this._queuesMap = new BeeQueue(name, config);
    }

    return this._queuesMap[name];
  }
}

module.export = Queue;
