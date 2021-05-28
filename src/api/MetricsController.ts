import { Request, Response } from 'express';
import { Logger } from '../config/Logger';
import { TeamMetricsRequest } from '../domain/Types';
import { appContext } from '../config/AppContext';
import { InvalidConfigurationException } from '../domain/project-tracking-system/Types';

export class MetricsController {
  static postMetrics = (req: Request, res: Response): void => {
    (async (): Promise<any> => {
      await MetricsController.handleRequest(req, res);
    })();
  };

  static updateMetrics = (req: Request, res: Response): void => {
    (async (): Promise<any> => {
      await MetricsController.handleRequest(req, res);
    })();
  };

  private static async handleRequest(
    req: Request,
    res: Response
  ): Promise<any> {
    try {
      await this.collectMetrics(req);
      res.json({ status: 'Done!.' });
      Logger.info('Done!');
    } catch (error) {
      Logger.error(error);
      if (error instanceof InvalidConfigurationException) {
        res.status(400).json({ error: 'Invalid request.' });
      } else {
        res.json({ error: 'Could not process request' });
      }
    }
  }

  private static async collectMetrics(req: Request): Promise<void> {
    const teamMetricRequest = this.createRequest(req);
    return appContext.apiMetricsService.metricsForRequest(teamMetricRequest);
  }

  private static createRequest(req: Request): TeamMetricsRequest {
    const body = req.body;
    const config = body.config || null;
    const method = req.method;

    const shouldUpdateEntries = method === 'PUT';

    if (!config) {
      throw new InvalidConfigurationException();
    }

    return {
      config,
      shouldUpdateEntries,
    };
  }
}
