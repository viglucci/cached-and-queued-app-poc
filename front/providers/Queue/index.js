const BeeQueue = require('bee-queue');

class Queue {
  constructor(Config) {
    this.Config = Config;
    this._queuesMap = {};
  }

  get(name, mode) {
    if (!this._queuesMap[name]) {
      const config = this.Config.get(`queue`);
      const redisConfig = config.redis,;
      this._queuesMap[name] = new BeeQueue(name, {
        redisConfig,
        ...config[mode]
      });
    }

    return this._queuesMap[name];
  }
}

module.exports = Queue;
