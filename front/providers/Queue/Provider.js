const { ServiceProvider } = require('@adonisjs/fold');

const Queue = require('./index');

class QueueProvider extends ServiceProvider {
  register() {
    this.app.singleton('Queue', () => {
      const Config = this.app.use('Adonis/Src/Config');
      return new Queue(Config);
    });
  }

  boot() {
    const queue = this.app.use('Queue');
    const missQueue = queue.get('miss');
    missQueue.ready(() => console.log('queue:miss ready'));
  }
}

module.exports = QueueProvider;
