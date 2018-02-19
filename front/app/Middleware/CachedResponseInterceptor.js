'use strict'

const Redis = use('Redis');
const Queue = use('Queue');

class CachedResponseInterceptor {

  async handle ({ request, response }, next) {
    try {
      const url = request.originalUrl();
      let cachedResponse = await Redis.get(url);
      let res = null;
      if (!cachedResponse) {
        res = await this.handleCacheMiss({ url, request, response });
      } else {
        cachedResponse = JSON.parse(cachedResponse);
        res = await this.handleCacheHit({ url, request, response, cachedResponse });
      }
      return response.status(res.status).send(res.body);
    } catch (err) {
      console.error(err);
      return response.status(500).send("Internal Server Error");
    }
  }

  async handleCacheMiss({ url, request, response }) {

    console.log(`no cached response for ${url}`);

    const missQueue = Queue.get('miss', 'pub');
    const job = missQueue.createJob({ url });

    return new Promise((resolve, reject) => {

      job.timeout(900);
      job.save();

      const timeout = setTimeout(() => {
        reject({ status: 503, content: "Service Unavailable"});
      }, 1000);

      job.on('succeeded', async (result) => {
        console.log(`job ${job.id} succeeded`);
        clearTimeout(timeout);
        const now = Math.round(new Date().getTime() / 1000);
        resolve(result);
      });

      job.on('failed', () => {
        console.log(`job ${job.id} failed`);
        reject();
      });

      job.on('stalled', () => {
        console.log(`job ${job.id} stalled`);
        reject();
      });
    });
  }

  async handleCacheHit({ url, request, response, cachedResponse }) {
    const now = Math.round(new Date().getTime() / 1000);
    if (cachedResponse.createdAt + 5 <= now) {
      console.log(`cached response for ${url} is stale`)
      const staleQueue = Queue.get('stale', 'pub');
      staleQueue.createJob({ url }).save();
    }

    return cachedResponse.value;
  }
}

module.exports = CachedResponseInterceptor
