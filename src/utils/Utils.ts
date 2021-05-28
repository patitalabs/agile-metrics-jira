import * as crypto from 'crypto';

export class Utils {
  static flatMap(func, arr) {
    return arr.map(func).reduce((x, y) => Utils.concat(x, y), []);
  }

  static concat(x: [], y: []) {
    return x.concat(y);
  }

  static toHash(theText: string): string {
    return crypto.createHash('sha512').update(theText).digest('hex');
  }

  static isDate(wrapper: any) {
    return !isNaN(wrapper.getDate());
  }

  static isDateInRange({
    createdAt,
    since,
    until,
  }: {
    createdAt: Date;
    since: Date;
    until?: Date;
  }): boolean {
    let isInRangeFromEnd = true;
    if (until) {
      isInRangeFromEnd = createdAt <= until;
    }
    const isInRangeFromStart = createdAt >= since;
    return isInRangeFromStart && isInRangeFromEnd;
  }

  static daysBetween(date1: Date, date2: Date): number {
    const oneDayInMillis = 1000 * 60 * 60 * 24;

    const differenceInMillis = Math.abs(date2.getTime() - date1.getTime());

    return Math.round(differenceInMillis / oneDayInMillis);
  }

  static formatDate(theDate: Date): string {
    return theDate.toISOString().substring(0, 10);
  }

  static mapToObj(theMap: Map<any, any>): any {
    const obj = {};
    theMap.forEach((v, k) => {
      obj[k] = v;
    });
    return obj;
  }
}
