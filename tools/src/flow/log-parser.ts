#!/usr/bin/env node
import { readFileSync, existsSync } from "fs";

type PerformanceData = {
  elapsedTime: number;
  modifiedFile: string | null;
}[];

enum State {
  NORMAL,
  PROCESSING
}

const REGEX = {
  SPLIT_DATE_AND_MESSAGE: /^\[([\d-:\. ]+)\] (.+)$/,
  EVENT_RECHECK: /^recheck/,
  EVENT_DONE: /^Done/
};

function getModifiedFile(line: string): string | null {
  const modifiedFile = line.match(/ \/.+/);

  if (modifiedFile && modifiedFile.length > 0) {
    return modifiedFile[0].trim();
  }

  return null;
}

function calcElapsedTimes(
  log: string,
  regexStart = REGEX.EVENT_RECHECK,
  regexEnd = REGEX.EVENT_DONE
): PerformanceData {
  const logLines = log.split("\n");
  const perfData: PerformanceData = [];

  let state: State = State.NORMAL;

  let startDate: Date | null = null;
  let modifiedFile: string | null = null;

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
      modifiedFile = getModifiedFile(logLines[i + 2]);

      state = State.PROCESSING;
    }

    if (state === State.PROCESSING && startDate && regexEnd.test(message)) {
      perfData.push({
        elapsedTime: new Date(date).getTime() - startDate.getTime(),
        modifiedFile
      });

      state = State.NORMAL;
    }
  });

  return perfData;
}

if (process.argv[2] === undefined) {
  throw new Error("Required argument log file path missing.");
}

const flowLog = process.argv[2];

if (!existsSync(flowLog)) {
  throw new Error(`Specified log file ${flowLog} does not exist.`);
}

const log = String(readFileSync(flowLog));
const elapsedTimes = calcElapsedTimes(log);

console.log(elapsedTimes);
