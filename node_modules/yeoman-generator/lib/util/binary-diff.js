'use strict';
const fs = require('fs');
const readChunk = require('read-chunk');
const istextorbinary = require('istextorbinary');
const dateFormat = require('dateformat');
const prettyBytes = require('pretty-bytes');
const Table = require('cli-table');

exports.isBinary = (existingFilePath, newFileContents) => {
  const existingHeader = readChunk.sync(existingFilePath, 0, 512);
  return (
    istextorbinary.isBinarySync(undefined, existingHeader) ||
    (newFileContents && istextorbinary.isBinarySync(undefined, newFileContents))
  );
};

exports.diff = (existingFilePath, newFileContents) => {
  const existingStat = fs.statSync(existingFilePath);
  const table = new Table({
    head: ['', 'Existing', 'Replacement', 'Diff']
  });

  let sizeDiff;

  if (!newFileContents) {
    newFileContents = Buffer.from([]);
  }

  if (existingStat.size > newFileContents.length) {
    sizeDiff = '-';
  } else {
    sizeDiff = '+';
  }

  sizeDiff += prettyBytes(Math.abs(existingStat.size - newFileContents.length));

  table.push(
    [
      'Size',
      prettyBytes(existingStat.size),
      prettyBytes(newFileContents.length),
      sizeDiff
    ],
    ['Last modified', dateFormat(existingStat.mtime), '', '']
  );

  return table.toString();
};
