#!/usr/bin/env node
import { readFileSync } from 'fs';

import { Measurement, LogParser } from '../types';
import { writeCSVFile, getLogArg } from '../util';


const REGEX = {
  LOG_REGEX: /^([\d:]+) - (.+)$/,
  LOG_DATE: /^(\d+:\d+:\d+):(\d+)/,
  EVENT_RECHECK: /File change detected/,
  EVENT_DONE: /Found \d+ errors/,
  FILE_NAME: /^[A-Za-z\/]+.+?:/,
};

function getDate(line: string): Date | null {
  const dateBits = line.match(REGEX.LOG_DATE);


  if (dateBits && dateBits.length === 3) {
    const date = new Date(`01-01-2000 ${dateBits[1]}`);
    date.setMilliseconds(Number(dateBits[2]));

    return date;
  }

  return null;
}

function getModifiedFile(line: string): string | null {
  const modifiedFile = line.match(REGEX.FILE_NAME);

  if (modifiedFile && modifiedFile.length > 0) {
    return modifiedFile[0].trim().slice(0, -1);
  }

  return null;
}

const calcMeasurements: LogParser = (
  logFile,
  regexStart = REGEX.EVENT_RECHECK,
  regexEnd = REGEX.EVENT_DONE,
) => {
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
      return;
    }

    if (regexStart.test(line)) {
      startDate = date;
      file = getModifiedFile(logLines[i + 1]);
    }

    if (startDate !== null && regexEnd.test(line)) {
      measurements.push({
        elapsedTime: date.getTime() - startDate.getTime(),
        version: '3.5',
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

writeCSVFile('tsc', measurements);
