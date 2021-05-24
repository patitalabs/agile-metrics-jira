import { ApiMetricsService } from './ApiMetricsService';
import { TeamMetricsRequest } from '../Types';

describe('ApiMetricsService', () => {
  it('should fail with invalid configuration', () => {
    const teamMetricsRequest: TeamMetricsRequest = {
      shouldUpdateEntries: false,
      config: { fake: 'config' },
    };
    const referenceDate = new Date('2019-02-09');

    try {
      ApiMetricsService.createConfigurationDescriptorsForRequest(
        teamMetricsRequest
      );
    } catch (e) {
      expect(e).toMatchSnapshot();
    }
  });

  it('should return existing unchanged config', () => {
    const teamMetricsRequest: TeamMetricsRequest = {
      shouldUpdateEntries: false,
      config: { fake: 'config' },
    };
    const referenceDate = new Date('2019-02-12');
    const generatedConfigs =
      ApiMetricsService.createConfigurationDescriptorsForRequest(
        teamMetricsRequest
      );
    expect(generatedConfigs).toMatchSnapshot();
  });
});
