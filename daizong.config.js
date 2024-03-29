const runTestCmd = 'wtr dist_tests/**/*.test.js --node-resolve --playwright --browsers webkit';

export default {
  // Starts development mode: watches and compiles all source files including tests.
  dev: {
    run: ['#clean', 'tsc -b tests -w'],
    envGroups: ['development'],
  },
  serve: {
    run: ['web-dev-server --open demo/ --node-resolve --watch'],
  },

  // Runs tests (you need to build the project first).
  t: runTestCmd,
  // Runs tests in watch mode (you need to build the project first).
  tw: `${runTestCmd} --watch`,

  // Cleans, lints, compiles sources and runs tests.
  build: {
    run: ['#clean', '#compile', '#lint', '#t'],
    envGroups: ['production'],
  },

  // Deletes compiled files, auto triggered by `#dev` or `#build`.
  clean: {
    run: {
      del: ['dist', 'dist_tests'],
    },
  },

  compile: 'tsc -b tests',

  // Lints the project using ESLint, auto triggered by `#build`.
  lint: {
    run: 'eslint --max-warnings 0 --ext .ts src/ tests/',
  },

  _: {
    envGroups: {
      production: {
        NODE_ENV: 'production',
      },
      development: {
        NODE_ENV: 'development',
      },
    },
  },
};
