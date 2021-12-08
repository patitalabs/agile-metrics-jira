import { JiraConfig, JiraService, Sprint, Task } from '../Types';
import { JiraMetricConverter } from './JiraMetricConverter';
import { PtsCollectorService } from '../../../domain/Types';
import {
  PtsCollectorConfig,
  PtsMetricItem,
} from '../../../domain/project-tracking-system/Types';
import { Utils } from '../../../utils/Utils';

export class JiraCollectorsService implements PtsCollectorService {
  constructor(private readonly jiraService: JiraService) {}

  public async fetch(
    ptsCollectorConfig: PtsCollectorConfig
  ): Promise<PtsMetricItem[]> {
    const tasks: Task[] = await this.tasks(ptsCollectorConfig);
    return tasks
      .filter((task) => task != null)
      .map((task) =>
        JiraMetricConverter.toMetricItem(ptsCollectorConfig, task)
      );
  }

  private async tasks(ptsCollectorConfig: PtsCollectorConfig): Promise<Task[]> {
    let tasks = [];
    if (ptsCollectorConfig.isKanban()) {
      tasks = await this.tasksForKanban(ptsCollectorConfig);
    } else {
      tasks = await this.tasksForSprint(ptsCollectorConfig);
    }
    return tasks;
  }

  private async tasksForSprint(
    ptsCollectorConfig: PtsCollectorConfig
  ): Promise<Task[]> {
    const sprints: Sprint[] = await this.jiraService.completedSprintsSince(
      ptsCollectorConfig.teamId,
      ptsCollectorConfig.since,
      ptsCollectorConfig.until
    );

    const taskPromises: Promise<Task[]>[] = sprints.map((sprint) =>
      this.sprintDetails(ptsCollectorConfig, sprint)
    );

    return Utils.flatMap((item) => item, await Promise.all(taskPromises));
  }

  private async tasksForKanban(
    ptsCollectorConfig: PtsCollectorConfig
  ): Promise<Task[]> {
    const jiraConfig = JiraCollectorsService.toJiraConfig(ptsCollectorConfig);
    return this.jiraService.completedKanbanIssuesSince(jiraConfig);
  }

  private static toJiraConfig(
    ptsCollectorConfig: PtsCollectorConfig
  ): JiraConfig {
    return { ...ptsCollectorConfig };
  }

  private async sprintDetails(
    ptsCollectorConfig: PtsCollectorConfig,
    sprint: Sprint
  ): Promise<Task[]> {
    const jiraConfig = JiraCollectorsService.toJiraConfig(ptsCollectorConfig);
    return this.jiraService.sprintData(jiraConfig, sprint);
  }
}
