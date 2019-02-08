"use strict";

function validateId(value) {
  const number = parseInt(value);
  if (isNaN(number) || number <= 0) {
    return "Please enter a valid product ID.";
  }
  return true;
}

function validatePrice(value) {
  const number = parseFloat(value);
  if (isNaN(number) || number <= 0) {
    return "Please enter a price.";
  }
  return true;
}

function validateQuantity(value) {
  const number = parseInt(value);
  if (isNaN(number)) {
    return "Please enter a quantity.";
  }
  if (number <= 0) {
    return "Please enter a positive quantity.";
  }
  return true;
}

module.exports = {
  validateId: validateId,
  validatePrice: validatePrice,
  validateQuantity: validateQuantity,
};