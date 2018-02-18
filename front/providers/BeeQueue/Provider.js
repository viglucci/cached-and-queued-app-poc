const { ServiceProvider } = require('@adonisjs/fold');

const Queue = require('./index');

class QueueProvider extends ServiceProvider {
  register() {
    this.app.singleton('Bee/Queue', () => {
      const Config = this.app.use('Adonis/Src/Config');
      return new Queue(Config);
    });
  }
}

module.exports = QueueProvider;
