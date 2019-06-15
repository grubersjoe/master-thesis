import { writeFileSync } from 'fs';
import { format } from 'date-fns';

import { Measurement } from './types';

export function writeCSVFile(type: 'flow' | 'typescript', data: Measurement[]) {
  const header =  `File,ElapsedTime,FlowVersion\n`;
  const csv = header.concat(
    data.reduce(
      (file, data) =>
        file.concat(`${data.file},${data.elapsedTime},v${data.flowVersion}\n`),
      '',
    ),
  );

  writeFileSync(`${type}-incremental-${format(new Date(), 'MM-DD_HH:mm')}.cv`, csv);
}
