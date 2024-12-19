import config from '../config';
import winston from 'winston';
import { getLogContext } from './context';

// Create a custom format that includes context
const contextFormat = winston.format((info) => {
  const context = getLogContext();
  return { ...context, ...info };
});

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    contextFormat(),
    winston.format.timestamp({ format: () => Date.now().toString() }),
    winston.format.json()
  ),
  defaultMeta: { service: config.app.name, env: config.app.env },
  transports: [new winston.transports.Console()],
});
