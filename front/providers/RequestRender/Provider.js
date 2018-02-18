const { ServiceProvider } = require('@adonisjs/fold');

const requestFactory = require('./index');

class RedisProvider extends ServiceProvider {
  register() {
    this.app.singleton('RequestRender', () => {
      const Config = this.app.use('Adonis/Src/Config');
      return requestFactory(Config);
    });
  }
}

module.exports = RedisProvider;
