import {
  PtsCollectorConfig,
  PtsMetricItem,
} from './project-tracking-system/Types';

export interface TeamMetricsRequest {
  shouldUpdateEntries: boolean;
  config: any;
}

export interface CoreMetricsService {
  publish(entries: any, shouldReplaceEntries: boolean);
}

export interface PtsCollectorService {
  fetch(ciCollectorConfig: PtsCollectorConfig): Promise<PtsMetricItem[]>;
}
