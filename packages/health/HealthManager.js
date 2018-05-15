const Logger = require('../logger/Logger').getInstance();

class HealthManager {

  addHealthCheckHook(healthHook, propertyName) {
    if (!healthHook || typeof healthHook !== 'function') throw new Error('Attempted to register a health check hook that was null or not a function.');
    if (!this.healthHooks) this.healthHooks = [];
    this.healthHooks.push({
      name: propertyName || healthHook.name.replace(/^bound /, ''),
      funct: this.wrapHealthHook(healthHook)
    });
  }

  wrapHealthHook(healthHook) {
    return async function() {
      try {
        return await healthHook();
      } catch (err) {
        Logger.error('Health Check hook failed:');
        Logger.error(err);
      }
    };
  }

  async getApplicationHealth() {
    let applicationHealth = {};
    await Promise.all(this.healthHooks.map(async (healthHook) => {
      applicationHealth[healthHook.name] = await healthHook.funct();
    }));
    return applicationHealth;
  }

}

class HealthManagerSingleton {
  static getInstance() {
    if (!HealthManagerSingleton.instance) HealthManagerSingleton.instance = new HealthManager();
    return HealthManagerSingleton.instance;
  }
}

module.exports = HealthManagerSingleton;
