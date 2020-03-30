// Global packages

// Private

// Public Constructor
module.exports = Resp;

function Resp(status, message) {
  this.error = status === 500;
  this.status = status;
  this.message = message;
  this.success = status < 300;
}

// Methods
