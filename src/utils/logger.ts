import config from '../config';
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: () => Date.now().toString() }),
    winston.format.json()
  ),
  defaultMeta: { service: config.app.name, env: config.app.env },
  transports: [new winston.transports.Console()],
});
