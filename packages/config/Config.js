const Logger = require('../logger/Logger').getInstance();
const dotenv_ext = require('dotenv-extended');

const defaultOptions = {
  coreRoutes: './core_routes.json',
  warnOnMissingCoreRoutes: true,
  appRoutes: './app_routes.json',
  warnOnMissingAppRoutes: true,
  path: 'config/env/loc.env',
  defaults: 'config/env/defaults.env',
  schema: 'config/env/schema.env',
  errorOnMissing: true,
  errorOnExtra: true,
  consts: {}
};

class Config {

  constructor() {
    this.env = {};
    this.consts = {};
    this.routes = { routes: []};
    this.isLoaded = false;
  }

  load(options = {}) {
    let opts = Object.assign({}, defaultOptions, options);
    this.initializeConfig(opts);
    this.initializeConsts(opts);
    this.initializeRoutes(opts);
    this.isLoaded = true;
    return this;
  }

  initializeConfig(opts) {
    dotenv_ext.load({
      path: opts.path,
      defaults: opts.defaults,
      schema: opts.schema,
      errorOnMissing: opts.errorOnMissing,
      errorOnExtra: opts.errorOnExtra
    });
    this.env = process.env;
  }

  initializeConsts(opts) {
    this.consts = opts.consts;
  }

  initializeRoutes(opts) {
    if (!opts.coreRoutes && opts.warnOnMissingCoreRoutes) Logger.warn('No coreRoutes supplied for route loading.');
    if (!opts.appRoutes && opts.warnOnMissingAppRoutes) Logger.warn('No appRoutes supplied for route loading.');
    let coreRoutes = (opts.coreRoutes) ? require(opts.coreRoutes) : { routes: [] };
    let appRoutes = (opts.appRoutes) ? require(opts.appRoutes) : { routes: [] };
    if (!coreRoutes.routes) Logger.error('Improperly formatted coreRoutes file. Missing required field [routes] array.');
    if (!appRoutes.routes) Logger.error('Improperly formatted appRoutes file. Missing required field [routes] array.');
    coreRoutes.routes = coreRoutes.routes.concat(appRoutes.routes);
    this.routes = coreRoutes;
  }
}

class ConfigSingleton {
  static getInstance() {
    if (!ConfigSingleton.instance) ConfigSingleton.instance = new Config();
    return ConfigSingleton.instance;
  }
}

module.exports = ConfigSingleton;
