const { Config } = require('../../../../index');

const chai  = require('chai');
const expect = chai.expect;
chai.use(require('chai-things'));

describe(`${__filename}`, () => {
  before(() => {
    Config.load({
      path: 'tests/unit/packages/config/loc.env',
      defaults: 'tests/unit/packages/config/defaults.env',
      schema: 'tests/unit/packages/config/schema.env'
    });
  });

  it('should have default value for an environment variable.', (done) => {
    expect(Config.env.DEFAULT_TEST).to.equal('default value for DEFAULT_TEST');
    done();
  });

  it('should have value that overrides default environment variable.', (done) => {
    expect(Config.env.TEST).to.not.equal('default value for TEST');
    expect(Config.env.TEST).to.equal('local value for TEST');
    done();
  });
});
