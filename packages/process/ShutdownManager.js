const Logger = require('../logger/Logger').getInstance();
const HealthManager = require('../health/HealthManager').getInstance();

class ShutdownManager {

  addShutdownHook(shutdownHook) {
    if (!shutdownHook || typeof shutdownHook !== 'function') throw new Error('Attempted to register a shutdown hook that was null or not a function.');
    if (!this.shutdownHooks) this.shutdownHooks = [];
    this.shutdownHooks.push(this.wrapShutdownHook(shutdownHook));
    this.registerShutdownListenerIfNotRegistered();
    this.registerHealthCheckListenerIfNotRegistered();
  }

  wrapShutdownHook(shutdownHook) {
    return async function() {
      try {
        await shutdownHook();
      } catch (err) {
        Logger.error('Shutdown hook failed:');
        Logger.error(err);
      }
    };
  }

  registerShutdownListenerIfNotRegistered() {
    if (this.listenerRegistered) return;
    this.isShuttingDown = false;
    process.on('SIGTERM', async () => {
      this.isShuttingDown = true;
      Logger.warn('SIGTERM received. Beginning graceful shutdown');
      await Promise.all(this.shutdownHooks.map((shutdownHook) => shutdownHook()));
      Logger.warn('Graceful shutdown complete.');
    });
    this.listenerRegistered = true;
  }

  registerHealthCheckListenerIfNotRegistered() {
    if (this.healthCheckregistered) return;
    HealthManager.addHealthCheckHook(this.healthHook.bind(this), 'application');
    this.healthCheckregistered = true;
  }

  healthHook() {
    return new Promise((resolve) => {
      resolve({
        ready: !this.isShuttingDown,
        shuttingDown: this.isShuttingDown
      });
    });
  }
}

class ShutdownManagerSingleton {
  static getInstance() {
    if (!ShutdownManagerSingleton.instance) ShutdownManagerSingleton.instance = new ShutdownManager();
    return ShutdownManagerSingleton.instance;
  }
}

module.exports = ShutdownManagerSingleton;
