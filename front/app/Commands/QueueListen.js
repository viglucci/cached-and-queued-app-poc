'use strict'

const { Command } = require('@adonisjs/ace')
const Queue = use('Queue');
const View = use('View');

class QueueListen extends Command {
  static get signature () {
    return 'queue:listen';
  }

  static get description () {
    return 'starts all of the queue subscribers that will work on queued jobs';
  }

  async handle (args, options) {
    this.info('queue:listen command invoked... starting queue listeners.');
    const Queue = use('Queue');
    const Redis = use('Redis');

    const missQueue = Queue.get('miss', 'sub');
    missQueue.ready(() => console.log('queue:miss:sub ready'));
    missQueue.process(this.processJob);

    const staleQueue = Queue.get('stale', 'sub');
    staleQueue.ready(() => console.log('queue:stale:sub ready'));
    staleQueue.process(this.processJob);
  }

  processJob(job, done) {
    console.log(`processing job stale:${job.id}`);
    const key = job.data.url;
    const date = new Date();
    const createdAt = Math.round(date.getTime() / 1000);
    const cacheItem = {
      createdAt: createdAt,
      value: {
        status: 200,
        body: View.render('welcome', {
          renderedAt: date.toString()
        })
      }
    };
    console.log(`job stale:${job.id} caching new value for ${key}`);
    Redis.set(key, JSON.stringify(cacheItem));
    Redis.expire(key, 10);
    return done(null, cacheItem.value);
  }
}

module.exports = QueueListen
