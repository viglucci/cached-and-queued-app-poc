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
const redis = use('Redis');
// const queue = use('Queue');

Route.get('*', async ({ request, response }) => {
  try {

    const url = request.originalUrl();
    const cachedResponse = await redis.get(url);

    if (!cachedResponse) {

      const missQueue = queue.get('miss');
      const job = missQueue.createJob({ url });

      return new Promise((resolve, reject) => {

        job.timeout(100);
        job.save();

        const timeout = setTimeout(() => {
          resolve(response.status(503).send());
        }, 1000);

        job.on('succeeded', async (result) => {
          console.log('job succeeded');
          clearTimeout(timeout);
          redis.set(url, result);
          resolve(response.status(200).send(result));
        });

        job.on('failed', (result) => {
          console.log('job failed');
          resolve(response.status(500).send());
        });

        job.on('stalled', (result) => {
          console.log('job stalled');
          resolve(response.status(503).send());
        });
      });
    }

    // else {
    //   await redis.set('date', new Date().toJSON());
    //   const date = await redis.get('date');
    //   response.status(200).send(date);
    // }
  } catch (err) {
    console.error(err);
    response.status(500).send(err);
  }
});
