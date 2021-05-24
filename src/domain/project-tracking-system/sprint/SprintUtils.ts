import { SprintHealthEstimate } from './SprintHealthEstimate';
import { Utils } from '../../../utils/Utils';

export class SprintUtils {
  static cycleTime(movedToDev: Date, resolutionDate: Date): number {
    let cycleTime = 0;
    if (movedToDev) {
      let endLeadTime = new Date();
      if (resolutionDate) {
        endLeadTime = resolutionDate;
      }
      cycleTime = Utils.daysBetween(movedToDev, endLeadTime);
    }
    return cycleTime;
  }

  static leadTime({ created, resolutionDate }): number {
    let leadTime = 0.0;
    if (created) {
      let endLeadTime = new Date();
      if (resolutionDate) {
        endLeadTime = resolutionDate;
      }
      leadTime = Utils.daysBetween(created, endLeadTime);
      if (leadTime === 0.0) {
        leadTime = 1;
      }
    }
    return leadTime;
  }

  static estimateHealth({
    estimate,
    actualTime,
    maxTime,
    estimationValues,
  }): number {
    if (!estimationValues) {
      estimationValues = [1, 2, 3, 5, 8];
    }
    return new SprintHealthEstimate({
      maxTime,
      estimationValues,
      estimate,
      actualTime,
    }).calculateHealthFactor();
  }

  static movedToDev(movedForwardDates: Date[]): Date {
    let movedToDev: Date = null;
    if (movedForwardDates.length > 0) {
      movedToDev = movedForwardDates.reduce((dateOne, dateTwo) =>
        dateOne < dateTwo ? dateOne : dateTwo
      );
    }
    return movedToDev;
  }
}
