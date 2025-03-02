const winston = require('winston')

const logger = winston.createLogger({
    levels: winston.config.npm.levels,
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({
            filename: "./logs/app.log",
            level: "debug",
            colorize: true
        })
    ],
  });

  module.exports = logger