import { existsSync, writeFileSync } from 'fs';

import { Measurement } from './types';

export function getLogArg(): string {
  if (process.argv[2] === undefined) {
    throw new Error('Required argument log file path missing.');
  }

  const logArg = process.argv[2];

  if (!existsSync(logArg)) {
    throw new Error(`Specified log file ${logArg} does not exist.`);
  }

  return logArg;
}

export function writeCSVFile(type: 'flow' | 'tsserver' | 'tsc', data: Measurement[]) {
  const header = `file,${type} elapsed time,${type} version\n`;
  const csv = header.concat(
    data.reduce(
      (file, data) =>
        file.concat(`${data.file},${data.elapsedTime},v${data.version}\n`),
      '',
    ),
  );

  const date = new Date()
    .toLocaleString()
    .slice(0, -3) // remove seconds
    .replace(', ', '_');

  writeFileSync(`${type}-incremental-${date}.cv`, csv);
}
