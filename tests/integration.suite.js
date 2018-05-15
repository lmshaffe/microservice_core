process.env.NODE_LOG_LEVEL = process.env.NODE_LOG_LEVEL || 'fatal';

const tests = [
  './integration/packages/logger/Logger.test',
];

tests.map((test) => {
  describe(`Running test suite ${test}`, () => { require(test); });
});
