'use strict';
const Logger = require('../../logger/Logger').getInstance();
const HealthManager = require('../../health/HealthManager').getInstance();

class HealthCheckRoutes {

  constructor(server) {
    Logger.trace('HealthCheckRoutes : constructor');
    this.server = server;
  }

  register(router) {
    Logger.trace('HealthCheckRoutes : register');
    router.get('/health', this.checkHealth.bind(this));
    return router;
  }

  async checkHealth(req, res) {
    Logger.trace('HealthCheckRoutes : checkHealth');
    let health = await HealthManager.getApplicationHealth();
    if (health && health.application && !health.application.ready) res = res.status(500);
    res.send(health);
  }
}

module.exports = HealthCheckRoutes;
