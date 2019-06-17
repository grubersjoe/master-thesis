#!/usr/bin/env node
import { readFileSync } from 'fs';

import { Measurement, LogParser } from '../types';
import { writeCSVFile, getLogArg } from '../util';

const REGEX = {
  VERSION_NUMBER: /version=(\d+\.\d+\.\d+)/,
  LOG_DATE: /^\[([\d-:\. ]+)\]/,
  EVENT_RECHECK: /recheck \d+ modified, \d+ deleted files/,
  EVENT_DONE: /Done$/,
};

function getFlowVersion(log: Buffer): string | null {
  const match = String(log).match(REGEX.VERSION_NUMBER);

  return match && match.length === 2 ? match[1] : null;
}

function getDate(line: string): Date | null {
  const match = line.match(REGEX.LOG_DATE);

  return match && match.length === 2 ? new Date(`${match[1]}`) : null;
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

  let startDate: Date | null = null;
  let file: string | null = null;

  logLines.forEach((line, i) => {
    if (line.length === 0) {
      return;
    }

    const date = getDate(line);

    if (!date) {
      throw new Error('Log date could not be parsed');
    }

    if (regexStart.test(line)) {
      startDate = date;
      file = getModifiedFile(logLines[i + 2]);
    }

    if (startDate !== null && regexEnd.test(line)) {
      measurements.push({
        elapsedTime: date.getTime() - startDate.getTime(),
        version: flowVersion,
        file,
      });

      startDate === null;
    }
  });

  return measurements;
};

const logArg = getLogArg();
const measurements = calcMeasurements(readFileSync(logArg));

console.log(measurements);

writeCSVFile('flow', measurements);
