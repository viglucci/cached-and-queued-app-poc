const { ServiceProvider } = require('@adonisjs/fold');

const Client = require('./index');

class RedisProvider extends ServiceProvider {
  register() {
    this.app.singleton('Redis', () => {
      const Config = this.app.use('Adonis/Src/Config');
      return new Client(Config);
    });
  }
}

module.exports = RedisProvider;
