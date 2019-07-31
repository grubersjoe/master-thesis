export interface Measurement {
  elapsedTime: number;
  version: string;
  file: string | null;
}

export type LogParser = (
  log: Buffer,
  regexStart?: RegExp,
  regexEnd?: RegExp,
) => Measurement[];
