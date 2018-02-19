const queue = use('Queue');

queue.get('miss', 'pub').ready(() => console.log('queue:miss:pub ready'));
queue.get('stale', 'pub').ready(() => console.log('queue:stale:pub ready'));
