module.exports = {
  apps: [{
    name: "GenericAdapter",
    script: ".src/index.js",
    output: '.src/logs/out.log',
    error: '.src/logs/error.log',
    log: '.src/logs/combined.outerr.log',
    merge_logs: true,
    instances: 1,
    watch: false,
    exec_mode: "cluster",
    // autorestart : false,
    max_restarts: 1,
    env_development: {
      NODE_ENV: "development",
      PORT: 9997,
      IP: "0.0.0.0",
      SERVER_REQ_TIMEOUT: 30000,
      VAS_ROOTPATH: ""
    },
    env_production: {
      NODE_ENV: "production"
    }
  }]
};