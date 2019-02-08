"use strict";

const inquirer = require("inquirer");
const mysql = require("mysql");
const tableFormat = require("./table-format.js");
const validator = require("./validator.js");

let connection;

function askAboutPurchase(products) {
  inquirer
    .prompt([
      {
        filter: value => parseInt(value),
        message: "Enter the product ID of the item for purchase.",
        name: "id",
        type: "input",
        validate: validator.validateId,
      },
      {
        filter: value => parseInt(value),
        message: "How many would you like to purchase?",
        name: "quantity",
        type: "input",
        validate: validator.validateQuantity,
      },
    ])
    .then((response) => {
      const product = products.find(product => product["item_id"] === response.id);

      if (!product) {
        console.log("\nItem ID " + response.id + " was not found.");
        connection.end();
        return;
      }

      if (product["stock_quantity"] < response.quantity) {
        console.log("Insufficient quantity!");
        connection.end();
        return;
      }

      purchase(response.id, response.quantity, product["price"], product["product_name"]);
    });
}

function printProducts(products) {
  const columns = [
    {name: "ID", width: 2},
    {name: "Product Name", width: 35},
    {name: "Price", width: 6},
  ];

  const rows = products.map((product) => {
    const row = [
      product["item_id"].toString(),
      product["product_name"],
      tableFormat.formatDollars(product["price"]),
    ];
    return row;
  });

  console.log(tableFormat.makeTable(columns, rows));
}

function purchase(id, quantity, price, productName) {
  const total = quantity * price;
  
  connection.query(
    "UPDATE products SET stock_quantity = stock_quantity - ?, product_sales = product_sales + ? WHERE item_id = ? AND stock_quantity > 0",
    [quantity, total, id],
    (error, response) => {
      if (error) {
        throw error;
      }

      if (response.affectedRows === 0) {
        console.log("Insufficient quantity!");
      } else {
        let result = "\n"
        result += "Total: " + tableFormat.formatDollars(total) + "\n";
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