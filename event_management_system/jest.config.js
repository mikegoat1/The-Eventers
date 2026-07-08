module.exports = {
  testEnvironment: 'node',
  transform: {
    // Explicit Babel config for tests only. The root .babelrc was renamed to
    // babel.config.jest.json so Next.js uses SWC (required by next/font) while
    // Jest keeps its Babel transform.
    '^.+\\.(js|jsx)$': [
      'babel-jest',
      { configFile: './babel.config.jest.json' },
    ],
  },
  moduleNameMapper: {
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@models/(.*)$': '<rootDir>/src/models/$1',
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
  },
  moduleFileExtensions: ['js', 'jsx'],
};
