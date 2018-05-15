const Logger = require('../logger/Logger').getInstance();
const fs = require('fs');

class CertificateLoader {

  load(options = {}) {
    let certificatePath = options.certificatePath || process.env.HTTPS_CERTIFICATE_PATH || null;
    let privateKeyPath = options.privateKeyPath || process.env.HTTPS_PRIVATE_KEY_PATH || null;
    try {
      return {
        certificate: fs.readFileSync(certificatePath),
        privateKey: fs.readFileSync(privateKeyPath)
      };
    } catch(err) {
      Logger.warn(`Attempted to load certificate from ${certificatePath}`);
      Logger.warn(`Attempted to load private key from ${privateKeyPath}`);
      Logger.warn('Failed to load HTTPS certificates, starting without HTTPS.');
    }
    return null;
  }

}


class CertificateLoaderSingleton {
  static getInstance() {
    if (!CertificateLoaderSingleton.instance) CertificateLoaderSingleton.instance = new CertificateLoader();
    return CertificateLoaderSingleton.instance;
  }
}

module.exports = CertificateLoaderSingleton;
