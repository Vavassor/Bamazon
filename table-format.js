"use strict";

function ellipsize(string, limit) {
  if (string.length > limit) {
    return string.substring(0, limit - 1) + "…";
  } else {
    return string;
  }
}

function formatDollars(amount) {
  return amount.toLocaleString("en-us", {style: "currency", currency: "USD"});
}

function limitColumns(string, limit) {
  return ellipsize(string, limit).padEnd(limit);
}

function makeTable(columns, rows) {
  let header = columns
    .map(column => column.name.padEnd(column.width))
    .join(" | ");
  
  let divider = columns
    .map(column => "-".repeat(column.width + 2))
    .join(" ")
    .substring(1);

  let body = rows.map((row) => {
      return row
        .map((value, index) => limitColumns(value, columns[index].width))
        .join(" | ");
    })
    .join("\n");

  let result = header + "\n"
    + divider + "\n"
    + body;

  return result;
}

module.exports = {
  formatDollars: formatDollars,
  makeTable: makeTable,
};