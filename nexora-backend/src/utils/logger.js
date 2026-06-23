import winston from 'winston';

const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

// Express middleware that logs each incoming request
const logger = (req, res, next) => {
  winstonLogger.info(`${req.method} ${req.originalUrl}`);
  next();
};

export default logger;
