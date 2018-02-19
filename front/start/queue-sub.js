const queue = use('Queue');

queue.get('miss', 'sub').ready(() => console.log('queue:miss:sub ready'));
