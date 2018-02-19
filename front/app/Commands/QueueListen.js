'use strict'

const { Command } = require('@adonisjs/ace')
const Queue = use('Queue');

class QueueListen extends Command {
  static get signature () {
    return 'queue:listen';
  }

  static get description () {
    return 'starts all of the queue subscribers that will work on queued jobs';
  }

  async handle (args, options) {
    this.info('queue:listen command invoked... starting queue listeners.');

  }
}

module.exports = QueueListen
