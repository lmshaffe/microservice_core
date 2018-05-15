'use strict';
const Logger = require('../../logger/Logger').getInstance();
//const Config = require('../../config/Config').getInstance();

class EnvironmentRoutes {

  constructor(server) {
    Logger.trace('EnvironmentRoutes : constructor');
    this.server = server;
  }

  register(router) {
    Logger.trace('EnvironmentRoutes : register');
    router.get('/env', this.getEnv.bind(this));
    return router;
  }
  getEnv(req, res) {
    Logger.trace('EnvironmentRoutes : getEnv');
    // res.json(Config);
    res.send(401);
  }
}

module.exports = EnvironmentRoutes;
