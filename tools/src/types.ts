export interface Measurement {
  elapsedTime: number;
  flowVersion: string;
  file: string | null;
}

export type LogParser = (
  log: Buffer,
  regexStart?: RegExp,
  regexEnd?: RegExp,
) => Measurement[];

export enum State {
  NORMAL,
  PROCESSING,
}
