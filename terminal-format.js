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

module.exports = {
  formatDollars: formatDollars,
  limitColumns: limitColumns,
};