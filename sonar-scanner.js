const sonarqubeScanner = require('sonarqube-scanner');
const dotenv = require('dotenv');

// Read configuration      
dotenv.config();

sonarqubeScanner(
  {
    serverUrl : process.env.SONAR_URL,
    token : process.env.SONAR_TOKEN,
    options: {
      'sonar.projectName': process.env.SONAR_PROJECT_NAME,
      'sonar.sources': process.env.SONAR_SOURCES,
      'sonar.inclusions': process.env.SONAR_INCLUSIONS, // Entry point of your code
      'sonar.tests': process.env.SONAR_TESTS,
      'sonar.test.inclusions': '**/*.test.js', // Do not change, you can include different extensions
      'sonar.testExecutionReportPaths': process.env.SONAR_TEST_FILE_PATH,
      'sonar.javascript.lcov.reportPaths': process.env.SONAR_COVERAGE_FILE_PATH
    }
  },
  () => process.exit()
)