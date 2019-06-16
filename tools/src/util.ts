import { existsSync, writeFileSync } from 'fs';
import { format } from 'date-fns';

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

export function writeCSVFile(type: 'flow' | 'typescript', data: Measurement[]) {
  const header = `file,elapsedTime,${type}Version\n`;
  const csv = header.concat(
    data.reduce(
      (file, data) =>
        file.concat(`${data.file},${data.elapsedTime},v${data.version}\n`),
      '',
    ),
  );

  writeFileSync(
    `${type}-incremental-${format(new Date(), 'MM-DD_HH:mm')}.cv`,
    csv,
  );
}
