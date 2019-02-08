"use strict";

const format = require("./terminal-format.js");
const inquirer = require("inquirer");
const mysql = require("mysql");

let connection;

function askAboutPurchase(products) {
  inquirer
    .prompt([
      {
        filter: value => parseInt(value),
        message: "Enter the product ID of the item for purchase.",
        name: "id",
        type: "input",
        validate: (value) => {
          const number = parseInt(value);
          if (isNaN(number)) {
            return "Please enter a valid product ID.";
          }

          const found = products.some(product => product["item_id"] === number);
          if (!found) {
            return "Please enter a valid product ID.";
          }

          return true;
        },
      },
      {
        filter: value => parseInt(value),
        message: "How many would you like to purchase?",
        name: "quantity",
        type: "input",
        validate: (value) => {
          const number = parseInt(value);
          if (isNaN(number)) {
            return "Please enter an amount.";
          }
          if (number <= 0) {
            return "Please enter a positive amount.";
          }
          return true;
        },
      },
    ])
    .then((response) => {
      const product = products.find(product => product["item_id"] === response.id);

      if (product["stock_quantity"] < response.quantity) {
        console.log("Insufficient quantity!");
        connection.end();
        return;
      }

      purchase(response.id, response.quantity, product["price"], product["product_name"]);
    });
}

function printProducts(response) {
  let result = "\n";
  
  result += "ID | Product Name                        | Price \n"
  result += "--- ------------------------------------- -------\n"

  for (const product of response) {
    result += format.limitColumns(product["item_id"].toString(), 2) + " | ";
    result += format.limitColumns(product["product_name"], 35) + " | "
    result += format.limitColumns(format.formatDollars(product["price"]), 6) + "\n";
  }

  console.log(result);
}

function purchase(id, quantity, price, productName) {
  connection.query(
    "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ? AND stock_quantity > 0",
    [quantity, id],
    (error, response) => {
      if (error) {
        throw error;
      }

      if (response.affectedRows === 0) {
        console.log("Insufficient quantity!");
      } else {
        let result = "\n"
        result += "Total: " + format.formatDollars(quantity * price) + "\n";
        result += "Purchase: " + quantity + " × " + productName;
        console.log(result);
      }

      connection.end();
    }
  );
}

function showProducts() {
  connection.query(
    "SELECT * FROM products WHERE stock_quantity > 0",
    function(error, response) {
      if (error) {
        throw error;
      }
      printProducts(response);
      askAboutPurchase(response);
    }
  );
}

connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "bochoro8",
  database: "bamazon",
});

connection.connect((error) => {
  if (error) {
    throw error;
  }
  showProducts();
});