#!/usr/bin/env node
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { format } from 'date-fns';

import { Measurement, State, LogParser } from '../types';
import { writeCSVFile } from '../util';

const REGEX = {
  VERSION_NUMBER: /version=(\d+\.\d+\.\d+)/,
  SPLIT_DATE_AND_MESSAGE: /^\[([\d-:\. ]+)\] (.+)$/,
  EVENT_RECHECK: /^recheck/,
  EVENT_DONE: /^Done/,
};

function getFlowVersion(log: Buffer): string | null {
  const match = String(log).match(REGEX.VERSION_NUMBER);

  return (match && match.length === 2) ? match[1] : null;
}

function getModifiedFile(line: string): string | null {
  const modifiedFile = line.match(/ \/.+/);

  if (modifiedFile && modifiedFile.length > 0) {
    return modifiedFile[0].trim();
  }

  return null;
}

const calcMeasurements: LogParser = (
  logFile,
  regexStart = REGEX.EVENT_RECHECK,
  regexEnd = REGEX.EVENT_DONE,
) => {
  const flowVersion = getFlowVersion(logFile);

  if (!flowVersion) {
    throw new Error('Flow version could not be parsed');
  }

  const logLines = String(logFile).split('\n');
  const measurements: Measurement[] = [];

  let state: State = State.NORMAL;

  let startDate: Date | null = null;
  let file: string | null = null;

  logLines.forEach((line, i) => {
    if (line.length === 0) {
      return;
    }

    const logParts = line.match(REGEX.SPLIT_DATE_AND_MESSAGE);

    if (!logParts) {
      throw new Error(`Log line could not be parsed: ${line}`);
    }

    const [_, date, message] = logParts;

    if (state === State.NORMAL && regexStart.test(message)) {
      startDate = new Date(date);
      file = getModifiedFile(logLines[i + 2]);

      state = State.PROCESSING;
    }

    if (state === State.PROCESSING && startDate && regexEnd.test(message)) {
      measurements.push({
        elapsedTime: new Date(date).getTime() - startDate.getTime(),
        flowVersion,
        file,
      });

      state = State.NORMAL;
    }
  });

  return measurements;
};


if (process.argv[2] === undefined) {
  throw new Error('Required argument log file path missing.');
}

const logArg = process.argv[2];

if (!existsSync(logArg)) {
  throw new Error(`Specified log file ${logArg} does not exist.`);
}

const measurements = calcMeasurements(readFileSync(logArg));

console.log(measurements);

writeCSVFile('flow', measurements);
