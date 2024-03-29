module.exports = {
  clearMocks: true,
  collectCoverageFrom: ["./src/**"],
  coverageThreshold: {
    global: {
      statements: 1,
      branches: 1,
      functions: 1,
      lines: 1,
    },
  },
  moduleFileExtensions: ["ts", "js"],
  moduleNameMapper: {
    "~/(.*)": "<rootDir>/src/$1",
  },
  roots: ["<rootDir>/src"],
  testEnvironment: "node",
  testPathIgnorePatterns: ["./node_modules/", "./dist/"],
  testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.(js?|ts?)$",
  transform: {
    "^.+.(ts|js)$": "ts-jest",
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!@foo)"],
};
