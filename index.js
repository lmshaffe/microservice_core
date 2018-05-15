const Logger            = require('./packages/logger/Logger').getInstance();
const Config            = require('./packages/config/Config').getInstance();
const CertificateLoader = require('./packages/certificates/CertificateLoader').getInstance();
const RouteLoader       = require('./packages/routes/RouteLoader').getInstance();
const ExpressServer     = require('./packages/server/ExpressServer').getInstance();
const Notifier          = require('./packages/notifications/Notifier').getInstance();
const PidManager        = require('./packages/process/PidManager').getInstance();
const ShutdownManager   = require('./packages/process/ShutdownManager').getInstance();
const HealthManager     = require('./packages/health/HealthManager').getInstance();

module.exports = {
  Logger,
  Config,
  CertificateLoader,
  RouteLoader,
  ExpressServer,
  Notifier,
  PidManager,
  ShutdownManager,
  HealthManager
};
