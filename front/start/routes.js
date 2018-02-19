'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')
const Redis = use('Redis');
const Queue = use('Queue');

Route.get('*', async ({ request, response }) => {
  try {

    const url = request.originalUrl();
    const cachedResponse = await Redis.get(url);
    const now = Math.round(new Date().getTime() / 1000);

    if (!cachedResponse) {

      console.log(`no cached response for ${url}`);

      const missQueue = Queue.get('miss', 'pub');
      const job = missQueue.createJob({ url });

      return new Promise((resolve, reject) => {

        job.timeout(100);
        job.save();

        const timeout = setTimeout(() => {
          resolve(response.status(503).send());
        }, 1000);

        job.on('succeeded', async (result) => {
          console.log(`job ${job.id} succeeded`);
          clearTimeout(timeout);
          const cacheItem = {
            createdAt: now,
            value: result
          };
          Redis.set(url, JSON.stringify(cacheItem));
          Redis.expire(url, 10);
          resolve(response.status(200).send(cacheItem));
        });

        job.on('failed', () => {
          console.log(`job ${job.id} failed`);
          resolve(response.status(500).send());
        });

        job.on('stalled', () => {
          console.log(`job ${job.id} stalled`);
          resolve(response.status(503).send());
        });
      });
    }

    const cacheItem = JSON.parse(cachedResponse);

    if (cacheItem.createdAt + 5 <= now) {
      console.log(`cached response for ${url} is stale`)
      const staleQueue = Queue.get('stale', 'pub');
      staleQueue.createJob({ url }).save();
    }

    response.status(200).send(cacheItem);

  } catch (err) {
    console.error(err);
    response.status(500).send(err);
  }
});
