import { Utils } from '../../utils/Utils';

export interface PtsMetricItem {
  id: string;
  dataType: string;
  createdAt: Date;
  key: string;
  createdBy: string;
  issueType: string;
  movedForward: number;
  movedBackward: number;
  storyPoints: number;
  assignees: string[];
  tags: string[];
  created: Date;
  finished: Date;
  leadTime: number;
  cycleTime: number;
  commentCount: number;
  jiraProject: string;
  teamName: string;
  estimateHealth: number;
  rawEstimateHealth: number;
  numberOfBugs: number;
}

export class InvalidConfigurationException extends Error {}

export class PtsCollectorConfig {
  teamId: number;
  teamName: string;
  workFlowType: 'sprint' | 'kanban';
  since: Date;
  until?: Date;
  workFlowMap?: { [name: string]: number };
  fields?: { [name: string]: string };
  estimateConfig?: { maxTime: number; estimationValues: number[] };

  constructor({
    teamId,
    since,
    until = null,
    workFlowMap,
    fields,
    teamName,
    workFlowType,
  }) {
    this.teamId = teamId;
    this.since = new Date(since);
    this.until = until ? new Date(until) : null;
    this.workFlowMap = workFlowMap;
    this.fields = fields;
    this.teamName = teamName;
    this.workFlowType = workFlowType ? workFlowType : 'sprint';

    if (!this.teamId || !this.teamName || !Utils.isDate(this.until)) {
      throw new InvalidConfigurationException();
    }
  }

  isKanban(): boolean {
    return this.workFlowType === 'kanban';
  }

  isSprint(): boolean {
    return this.workFlowType === 'sprint';
  }
}
