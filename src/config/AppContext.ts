import { CoreMetricsClientImpl } from '../infrastructure/core-metrics/CoreMetricsClientImpl';
import { AppConfig } from './AppConfig';
import { CoreMetricsService, PtsCollectorService } from '../domain/Types';
import { ApiMetricsService } from '../domain/project-tracking-system/ApiMetricsService';
import { JiraService } from '../infrastructure/jira/Types';
import { JiraClientImpl } from '../infrastructure/jira/JiraClientImpl';
import { JiraCollectorsService } from '../infrastructure/jira/collector/JiraCollectorsService';
import { JiraRepositoryImpl } from '../infrastructure/jira/JiraRepositoryImpl';
import { JiraServiceImpl } from '../infrastructure/jira/JiraServiceImpl';

function coreMetricsService(): CoreMetricsService {
  return new CoreMetricsClientImpl({
    host: AppConfig.coreMetricsUrl(),
  });
}

function jiraService(): JiraService {
  const jiraClient = new JiraClientImpl({
    host: `${AppConfig.jiraHost()}`,
    apiToken: `${AppConfig.jiraToken()}`,
  });
  const jiraRepository = new JiraRepositoryImpl(jiraClient);
  return new JiraServiceImpl(jiraRepository);
}

function scmCollectorService(): PtsCollectorService {
  return new JiraCollectorsService(jiraService());
}

function apiMetricsServiceInstance(): ApiMetricsService {
  return new ApiMetricsService(coreMetricsService(), scmCollectorService());
}

export const appContext = Object.freeze({
  apiMetricsService: apiMetricsServiceInstance(),
});
