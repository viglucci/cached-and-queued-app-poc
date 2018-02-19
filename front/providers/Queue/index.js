const BeeQueue = require('bee-queue');

class Queue {
  constructor(Config) {
    this.Config = Config;
    this._queuesMap = {};
  }

  get(name, mode) {
    if (!this._queuesMap[name]) {
      const config = this.Config.get(`queue`);
      const redisConfig = config.redis;
      const modeConfig = config[name][mode];
      this._queuesMap[name] = new BeeQueue(name, {
        redis: redisConfig,
        ...modeConfig
      });
    }

    return this._queuesMap[name];
  }
}

module.exports = Queue;
