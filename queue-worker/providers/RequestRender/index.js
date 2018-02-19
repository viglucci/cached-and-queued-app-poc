const request = require('request');

module.exports = function requestFactory (Config) {
  const config = Config('request');
  return (options) => {
    return request({
      ...config,
      ...options
    });
  };
};
