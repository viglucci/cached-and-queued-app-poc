module.exports = {
  redis: {
    host: 'redis',
    port: 6379,
    db: 0
  },
  miss: {
    pub: {
      isWorker: false,
      getEvents: true,
      sendEvents: true,
      storeJobs: true
    },
    sub: {
      isWorker: true,
      getEvents: true,
      sendEvents: true,
      storeJobs: true
    }
  },
  stale: {
    pub: {
      isWorker: false,
      getEvents: true,
      sendEvents: true,
      storeJobs: true
    },
    sub: {
      isWorker: true,
      getEvents: true,
      sendEvents: true,
      storeJobs: true
    }
  }
};
