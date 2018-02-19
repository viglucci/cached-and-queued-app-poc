const Queue = use('Queue');
const Redis = use('Redis');

const missQueue = Queue.get('miss', 'sub');
missQueue.ready(() => console.log('queue:miss:sub ready'));
missQueue.process((job, done) => {
  console.log(`processing job miss:${job.id}`);
  return done(null, job.data);
});

const staleQueue = Queue.get('stale', 'sub');
staleQueue.ready(() => console.log('queue:stale:sub ready'));
staleQueue.process((job, done) => {
  console.log(`processing job stale:${job.id}`);
  const key = job.data.url;
  const cacheItem = {
    createdAt: Math.round(new Date().getTime() / 1000),
    value: job.data
  };
  console.log(`job stale:${job.id} caching new value for ${key}`);
  Redis.set(key, JSON.stringify(cacheItem));
  Redis.expire(key, 10);
  return done(null, cacheItem);
});
