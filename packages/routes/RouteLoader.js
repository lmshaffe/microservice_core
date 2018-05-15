const Logger = require('../logger/Logger').getInstance();
const Config = require('../config/Config').getInstance();
const path = require('path');

class RouteLoader {

  load(server, options = {}) {
    let loadOrder = options.loadOrder || Config.routes || [];
    let routes = loadOrder.routes.map((loadPath) => {
      Logger.info(`Loading route: '${loadPath}'`);
      let name = path.basename(loadPath);
      let route = require(loadPath);
      let routeInstance = new route(server);
      if (!routeInstance.register) Logger.error(`Router Class ${name} at path ${loadPath} did not have a register function. Could not register route.`);
      server.app.use('/', routeInstance.register(server.router));
      return [name, routeInstance];
    });
    server.routes = new Map(routes);
  }

}

class RouteLoaderSingleton {
  static getInstance() {
    if (!RouteLoaderSingleton.instance) RouteLoaderSingleton.instance = new RouteLoader();
    return RouteLoaderSingleton.instance;
  }
}

module.exports = RouteLoaderSingleton;
