# 🅱amazon

A CLI for a mock storefront. It's three separate apps which interact with the same database, giving a customer view, a manager view, and a supervisor view.

It runs in [Node.js](https://nodejs.org) and uses [MySQL](https://www.mysql.com/) for its database.

## Installation

1. Run `schema.sql` and then `seeds.sql` in MySQL to initialise the database.
2. The three apps use the same dependencies, so running `npm install` in the root directory works for all three.

## Customer

This lists available products and allows a user to order an item.

![Customer View Screenshot](images/Demo-Customer.png)

## Manager

This gives a few available commands for a prospective manager.

- View Products for Sale
- View Low Inventory
- Add to Inventory
- Add New Product

![View Products For Sale Screenshot](images/Demo-Manager-View-Products-For-Sale.png)

![View Low Inventory Screenshot](images/Demo-Manager-View-Low-Inventory.png)

![Add To Inventory Screenshot](images/Demo-Manager-Add-To-Inventory.png)

![Add New Product Screenshot](images/Demo-Manager-Add-New-Product.png)

## Supervisor

This provides a few services for a supervisor.

- View Product Sales by Department
- Create New Department

![View Department Sales Screenshot](images/Demo-Supervisor-View-Department-Sales.png)

![Create New Department Screenshot](images/Demo-Supervisor-Create-New-Department.png)