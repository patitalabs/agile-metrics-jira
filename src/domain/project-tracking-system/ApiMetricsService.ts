import { Logger } from '../../config/Logger';
import {
  PtsCollectorService,
  CoreMetricsService,
  TeamMetricsRequest,
} from '../Types';
import { InvalidConfigurationException, PtsCollectorConfig } from './Types';

export class ApiMetricsService {
  constructor(
    private readonly coreMetricsService: CoreMetricsService,
    private readonly ciCollectorService: PtsCollectorService
  ) {}

  public async metricsForRequest(
    teamMetricsRequest: TeamMetricsRequest
  ): Promise<void> {
    try {
      Logger.info(`teamMetricsRequest: ${JSON.stringify(teamMetricsRequest)}`);
      const configurationDescriptors =
        ApiMetricsService.createConfigurationDescriptorsForRequest(
          teamMetricsRequest
        );
      Logger.info(
        `created configurations: ${JSON.stringify(configurationDescriptors)}`
      );

      for (const configurationDescriptor of configurationDescriptors) {
        const scmMetricItems = await this.ciCollectorService.fetch(
          new PtsCollectorConfig(configurationDescriptor.config)
        );
        await this.coreMetricsService.publish(
          scmMetricItems,
          configurationDescriptor.shouldUpdateEntries
        );
      }
      Logger.info('Done!');
    } catch (error) {
      Logger.error(`message: ${error.message}, stack:${error.stack}`);
      if (error instanceof InvalidConfigurationException) {
        throw error;
      }
    }
  }

  static createConfigurationDescriptorsForRequest(
    teamMetricsRequest: TeamMetricsRequest
  ): any[] {
    if (teamMetricsRequest.config) {
      return [{ ...teamMetricsRequest }];
    }

    throw Error(
      `Unable to create configuration for request ${JSON.stringify(
        teamMetricsRequest
      )}`
    );
  }
}
