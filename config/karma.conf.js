module.exports = function (config) {
  config.set({
    basePath: '../',

    files: [
      'app/lib/angular-*.js',
      'test/lib/angular/angular-mocks.js',
      'app/js/util.js',
      'app/js/app.js',
      'test/unit/**/*.js'
    ],

    frameworks: ['jasmine'],

    autoWatch: true,

    browsers: ['Chrome'],

    junitReporter: {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }
  });
};
