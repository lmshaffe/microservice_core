const Logger = require('../logger/Logger').getInstance();
const npid = require('npid');
const path = require('path');

class PidManager {

  generate() {
    try {
      let pidPath = path.join(process.cwd(), 'pid');
      Logger.info(`Creating pid at ${pidPath}`);
      let pid = npid.create(pidPath, true);
      pid.removeOnExit();
    } catch (err) {
      Logger.warn('Could not create pid file for graceful shutdown.');
      Logger.error(err);
    }
  }

}


class PidManagerSingleton {
  static getInstance() {
    if (!PidManagerSingleton.instance) PidManagerSingleton.instance = new PidManager();
    return PidManagerSingleton.instance;
  }
}

module.exports = PidManagerSingleton;
