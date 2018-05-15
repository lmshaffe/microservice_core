process.env.NODE_LOG_LEVEL = process.env.NODE_LOG_LEVEL || 'fatal';

const tests = [
  './unit/packages/logger/Logger.test',
  './unit/packages/config/Config.test'
];

tests.map((test) => {
  describe(`Running test suite ${test}`, () => { require(test); });
});
