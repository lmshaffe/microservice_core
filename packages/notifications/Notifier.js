const Logger = require('../logger/Logger').getInstance();

class Notifier {

  constructor() {
    this.enabled = false;
  }

  enable() {
    this.enabled = true;
    return this;
  }

  disable() {
    this.enabled = false;
    return this;
  }

  inject(notifier) {
    if (!notifier['notify'] || typeof notifier['notify'] !== 'function') {
      Logger.warn('A notifier was passed into the core framework Notifier.inject function that has no notify function. Ignoring.');
      return;
    }
    this.notifier = notifier;
    this.enable();
    return this;
  }

  notify(message, options) {
    if (!this.enabled) return;
    if (!this.notifier) {
      Logger.warn('Notification requested but no notification implementation supplied.');
      Logger.warn(`Message: ${message}`);
      return;
    }
    this.notifier.notify(message, options);
  }

}


class NotifierSingleton {
  static getInstance() {
    if (!NotifierSingleton.instance) NotifierSingleton.instance = new Notifier();
    return NotifierSingleton.instance;
  }
}

module.exports = NotifierSingleton;
