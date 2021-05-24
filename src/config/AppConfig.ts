function checkEnvVar(...theVariables: string[]): void {
  theVariables.forEach((theVariable) => {
    if (!process.env[theVariable]) {
      throw Error(`env.${theVariable} not set!`);
    }
  });
}

export class AppConfig {
  static port(): number {
    return (process.env.PORT || 3000) as number;
  }

  static isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  static jiraToken(): string {
    checkEnvVar('JIRA_API_TOKEN');
    return process.env.JIRA_API_TOKEN;
  }

  static jiraHost(): string {
    checkEnvVar('JIRA_HOST');
    return process.env.JIRA_HOST;
  }

  static coreMetricsUrl(): string {
    checkEnvVar('CORE_METRICS_URL');
    return process.env.CORE_METRICS_URL;
  }
}
