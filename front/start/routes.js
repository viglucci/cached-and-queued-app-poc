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

Route.get('/', async ({ request, response }) => {
  try {
    await redis.set('date', new Date().toJSON());
    const date = await redis.get('date');
    response.status(200).send(date);
  } catch (err) {
    response.status(500).send(err);
  }
});
