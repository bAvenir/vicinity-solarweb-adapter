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
      'sonar.sources': process.env.SONAR_SOURCES
    }
  },
  () => process.exit()
)