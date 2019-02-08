"use strict";

const inquirer = require("inquirer");
const mysql = require("mysql");
const tableFormat = require("./table-format.js");
const validator = require("./validator.js");

let connection;

function createNewDepartment() {
  inquirer
    .prompt([
      {
        message: "Enter the department name.",
        name: "departmentName",
        type: "input",
      },
      {
        message: "Enter the overhead costs.",
        name: "overheadCosts",
        type: "input",
        validate: validator.validatePrice,
      },
    ])
    .then((response) => {
      requestNewDepartment(response.departmentName, response.overheadCosts);
    });
}

function printDepartments(departments) {
  const columns = [
    {name: "ID", width: 2},
    {name: "Department Name", width: 15},
    {name: "Overhead Costs", width: 15},
  ];

  const rows = departments.map((department) => {
    const row = [
      department["department_id"].toString(),
      department["department_name"],
      tableFormat.formatDollars(department["overhead_costs"]),
    ];
    return row;
  });

  console.log(tableFormat.makeTable(columns, rows));
}

function requestAction() {
  inquirer
    .prompt([
      {
        choices: ["View Product Sales by Department", "Create New Department", "Exit"],
        message: "What would you like to do?",
        name: "action",
        type: "list",
      },
    ])
    .then((response) => {
      switch (response.action) {
        case "View Product Sales by Department":
          viewProductSalesByDepartment();
          break;
        
        case "Create New Department":
          createNewDepartment();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });
}

function requestNewDepartment(departmentName, overheadCosts) {
  connection.query(
    "INSERT INTO departments SET ?",
    {
      "department_name": departmentName,
      "overhead_costs": overheadCosts,
    },
    (error, response) => {
      if (error) {
        throw error;
      }
      console.log("\nDepartment added.");
      connection.end();
    }
  );
}

function viewProductSalesByDepartment() {
  connection.query(
    "SELECT department_id, department_name, overhead_costs FROM departments",
    (error, response) => {
      if (error) {
        throw error;
      }

      printDepartments(response);
      connection.end();
    });
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