#!/usr/bin/env node
const fs = require('fs');

const diagnostics = JSON.parse(fs.readFileSync('typescript-diagnostics.json'));

for (const [msg, d] of Object.entries(diagnostics)) {
  if (String(d.code) === String(process.argv[2]).substr(2)) {
    console.log(msg);
    return;
  }
}
