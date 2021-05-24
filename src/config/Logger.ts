import { createLogger, format, transports } from 'winston';
import { AppConfig } from './AppConfig';

const IS_NOT_PRODUCTION = !AppConfig.isProduction();

export const Logger = createLogger({
  level: IS_NOT_PRODUCTION ? 'debug' : 'info',
  format: IS_NOT_PRODUCTION ? format.simple() : format.json(),
  transports: [new transports.Console()],
});
