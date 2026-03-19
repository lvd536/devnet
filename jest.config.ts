import nextJest from "next/jest.js";

const createJestConfig = nextJest({
    dir: "./",
});

const config = {
    coverageProvider: "v8",
    testEnvironment: "jsdom",
    testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
};

export default createJestConfig(config);
