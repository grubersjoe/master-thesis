#!/usr/bin/env node
import { readFileSync } from 'fs';

import { Measurement, LogParser } from '../types';
import { writeCSVFile, getLogArg } from '../util';

const TIME_THRESHOLD = 20; // ms

const REGEX = {
  VERSION_NUMBER: /Version: (\d+\.\d+\.\d+)/,
  LOG_DATE: /^\w+\s+\d+\s+\[(\d+:\d+:\d+)\.(\d+)\]/,
};

function getTypeScriptVersion(log: Buffer): string | null {
  const match = String(log).match(REGEX.VERSION_NUMBER);

  return match && match.length === 2 ? match[1] : null;
}

function getDate(line: string): Date | null {
  const dateBits = line.match(REGEX.LOG_DATE);

  if (dateBits && dateBits.length === 3) {
    const date = new Date(`01-01-2000 ${dateBits[1]}`);
    date.setMilliseconds(Number(dateBits[2]));

    return date;
  }

  return null;
}

const calcMeasurements: LogParser = logFile => {
  const tsVersion = getTypeScriptVersion(logFile);

  if (!tsVersion) {
    throw new Error('TypeScript version could not be parsed');
  }

  const logLines = String(logFile).split('\n');
  const measurements: Measurement[] = [];

  let startDate: Date | null = null;
  let file: string | null = null;
  let seq: number | null = null;

  logLines.forEach((line, i) => {
    if (line.length === 0 || i === 0) {
      return;
    }

    // The date is always in the previous line
    const date = getDate(logLines[i - 1]);

    if (!date) {
      return;
    }

    try {
      const message = JSON.parse(line);

      if (message.type === 'request' && message.command === 'updateOpen') {
        startDate = date;
      }

      if (message.type === 'request' && message.command === 'geterr') {
        file = message.arguments.files[0];
        seq = message.seq;
      }

      if (
        message.type === 'event' &&
        message.event === 'requestCompleted' &&
        seq === message.body.request_seq
      ) {
        if (!startDate) {
          throw new Error('The startDate could not be determined');
        }

        const elapsedTime = date.getTime() - startDate.getTime();

        if (elapsedTime > TIME_THRESHOLD) {
          measurements.push({
            elapsedTime,
            version: tsVersion,
            file,
          });
        }

        startDate = null;
      }
    } catch (e) {
      return; // skip non JSON messages
    }
  });

  return measurements;
};

const logArg = getLogArg();
const measurements = calcMeasurements(readFileSync(logArg));

console.log(measurements);

writeCSVFile('tsserver', measurements);
