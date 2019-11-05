#!/usr/bin/env node
const fetch = require('node-fetch');

const user = process.argv[2];
const password = process.argv[3];

const maxPage = 80;

const headers = new fetch.Headers();
headers.set('Authorization', 'Basic ' + Buffer.from(`${user}:${password}`).toString('base64'));

function fetchData(page) {
  return fetch(`https://api.github.com/repos/facebook/flow/issues?state=closed&per_page=100&page=${page}`, {
    method: 'GET',
    headers,
  })
    .then(issues => issues.json())
    .then(issues => {
      if (!issues) {
        console.error('stop');
        return;
      }

      issues
        .filter(issue => issue.pull_request === undefined)
        .forEach(issue => {
          const dateClosedAt = new Date(issue.closed_at);
          const dateCreatedAt = new Date(issue.created_at);
          const openInHours = ((dateClosedAt - dateCreatedAt) / 1000 / 60 / 60).toFixed(2);

          console.log(issue.number, ',', openInHours);
        });
    });
}

async function main() {
  for (let curPage = 1; curPage <= maxPage; curPage++) {
    console.error(curPage, maxPage);
    await fetchData(curPage);
  }
}

main();

