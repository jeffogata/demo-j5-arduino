const { logLevels, levelNames } = require('./SimpleLogLevels');

module.exports = class SimpleLog {
  constructor(logLevel) {
    this.setLogLevel(logLevel);
  }

  setLogLevel(logLevel) {
    this.logLevel = 
      (!logLevel || logLevel < logLevels.off) ? logLevels.off :
      (logLevel > logLevels.trace) ? logLevels.trace :
      logLevel;
  }

  trace(message) {
    this.logMessage(message, logLevels.trace);
  }

  info(message) {
    this.logMessage(message, logLevels.info);
  }

  warn(message) {
    this.logMessage(message, logLevels.warn);
  }

  error(message) {
    this.logMessage(message, logLevels.error);
  }

  logMessage(message, level) {
    if (this.logLevel >= level) {
      console.log(`${levelNames[level]} :: ${message}`);
    }
  }
}
