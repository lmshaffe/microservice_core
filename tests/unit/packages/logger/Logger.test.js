const { Logger } = require('../../../../index');

const chai  = require('chai');
const expect = chai.expect;
chai.use(require('chai-things'));

describe(`${__filename}`, () => {
  it('should have have all log level functions attached.', (done) => {
    const logger_levels = require('../../../../packages/logger/logger_levels.json');
    logger_levels.logLevels.forEach((level) => {
      expect(Logger).to.have.property(level.name);
      expect(Logger[level.name]).to.be.a('function');
    });
    done();
  });
});
