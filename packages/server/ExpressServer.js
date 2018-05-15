const express = require('express');
const https = require('https');
const http = require('http');
const bodyParser = require('body-parser');

const Logger = require('../logger/Logger').getInstance();
const Config = require('../config/Config').getInstance();
const CertificateLoader = require('../certificates/CertificateLoader').getInstance();
const PidManager = require('../process/PidManager').getInstance();
const ShutdownManager = require('../process/ShutdownManager').getInstance();


class ExpressServer {

  start(options = {}) {
    PidManager.generate();
    let httpPort = options.httpPort || Config.env.HTTP_PORT || 3000;
    let httpsPort = options.httpsPort || Config.env.HTTPS_PORT || 3443;
    let certificates = CertificateLoader.load();

    this.app = express();
    this.router = express.Router();

    if (options.viewPath) {
      this.app.set('view engine', 'pug');
      this.app.set('views', options.viewPath);
    }

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.httpServer = http.createServer(this.app).listen(httpPort);
    Logger.info(`Starting the HTTP application on port ${httpPort}`);
    if (certificates) {
      this.httpsServer = https.createServer({
        cert: certificates.certificate, key: certificates.privateKey
      }, this.app).listen(httpsPort);
      Logger.info(`Starting the HTTPS application on port ${httpsPort}`);
    }

    ShutdownManager.addShutdownHook(this.stop.bind(this));
  }

  async stop() {
    await this.closeServer(this.httpServer, 'HTTP Server');
    await this.closeServer(this.httpsServer, 'HTTPS Server');
    Logger.warn('The application server is now stopped.');
  }

  closeServer(server, serverName) {
    return new Promise((resolve) => {
      if (!server) resolve();
      server.close(() => {
        Logger.warn(`${serverName} has shut down.`);
        resolve();
      });
    });
  }

}


class ExpressServerSingleton {
  static getInstance() {
    if (!ExpressServerSingleton.instance) ExpressServerSingleton.instance = new ExpressServer();
    return ExpressServerSingleton.instance;
  }
}

module.exports = ExpressServerSingleton;
