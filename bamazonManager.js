"use strict";

const format = require("./terminal-format.js");
const inquirer = require("inquirer");
const mysql = require("mysql");

let connection;

function addNewProduct() {
  inquirer
    .prompt([
      {
        message: "Enter the product name.",
        name: "productName",
        type: "input",
      },
      {
        message: "Enter the department name.",
        name: "departmentName",
        type: "input",
      },
      {
        filter: value => parseFloat(value),
        message: "Enter the price.",
        name: "price",
        type: "input",
        validate: (value) => {
          const number = parseFloat(value);
          if (isNaN(number) || number <= 0) {
            return "Please enter a price.";
          }
          return true;
        },
      },
      {
        filter: value => parseInt(value),
        message: "Enter the initial stock quantity.",
        name: "stockQuantity",
        type: "input",
        validate: validateQuantity,
      },
    ])
    .then((response) => {
      requestAddProduct(response.productName, response.departmentName, response.price, response.stockQuantity);
    });
}

function addQuantityOfItem(quantity, id) {
  connection.query(
    "UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?",
    [quantity, id],
    (error, response) => {
      if (error) {
        throw error;
      }

      if (response.affectedRows === 0) {
        console.error("\nItem ID " + id + " was not found.");
      } else {
        console.log("\nItem ID " + id + " now has " + quantity + " more in stock.");
      }

      connection.end();
    });
}

function addToInventory() {
  inquirer
    .prompt([
      {
        filter: value => parseInt(value),
        message: "Enter the item ID.",
        name: "id",
        type: "input",
        validate: (value) => {
          const number = parseInt(value);
          if (isNaN(number)) {
            return "Please enter a valid product ID.";
          }
          return true;
        },
      },
      {
        filter: value => parseInt(value),
        message: "Enter the quantity to add.",
        name: "quantity",
        type: "input",
        validate: validateQuantity,
      },
    ])
    .then((response) => {
      addQuantityOfItem(response.quantity, response.id);
    });
}

function printProducts(products) {
  let result = "\n";

  result += "ID | Product Name                        | Price  | Quantity\n";
  result += "--- ------------------------------------- -------- ---------";

  for (const product of products) {
    result += "\n";
    result += format.limitColumns(product["item_id"].toString(), 2) + " | ";
    result += format.limitColumns(product["product_name"], 35) + " | ";
    result += format.limitColumns(format.formatDollars(product["price"]), 6) + " | ";
    result += format.limitColumns(product["stock_quantity"].toString(), 5);
  }

  console.log(result);
}

function requestAction() {
  inquirer
    .prompt([
      {
        choices: [
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product",
          "Exit",
        ],
        message: "What would you like to do?",
        name: "action",
        type: "list",
      },
    ])
    .then((response) => {
      switch (response.action) {
        case "View Products for Sale":
          viewProductsForSale();
          break;

        case "View Low Inventory":
          viewLowInventory();
          break;

        case "Add to Inventory":
          addToInventory();
          break;

        case "Add New Product":
          addNewProduct();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });
}

function requestAddProduct(productName, departmentName, price, stockQuantity) {
  connection.query(
    "INSERT INTO products SET ?",
    {
      "product_name": productName,
      "department_name": departmentName,
      "price": price,
      "stock_quantity": stockQuantity,
    },
    (error, response) => {
      if (error) {
        throw error;
      }
      console.log("\nItem added.");
      connection.end();
    }
  );
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

function viewLowInventory() {
  connection.query(
    "SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5",
    (error, response) => {
      if (error) {
        throw error;
      }
      if (response.length === 0) {
        console.log("\nNo low inventory.");
      } else {
        printProducts(response);
      }
      connection.end();
    }
  );
}

function viewProductsForSale() {
  connection.query(
    "SELECT item_id, product_name, price, stock_quantity FROM products",
    (error, response) => {
      if (error) {
        throw error;
      }
      printProducts(response);
      connection.end();
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
  requestAction();
});