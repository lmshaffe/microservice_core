const { Logger } = require('../../../../index');

// const sinon = require('sinon');
const chai  = require('chai');
// const expect = chai.expect;
chai.use(require('chai-things'));

describe(`${__filename}`, () => {
  it('should exist as a dummy test', (done) => {
    Logger.info('Hello world!');
    done();
  });
});
