DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(13, 4) NOT NULL,
    stock_quantity INTEGER NOT NULL,
    product_sales DECIMAL(13, 4) NOT NULL DEFAULT 0
);

CREATE TABLE departments (
	department_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(50) NOT NULL,
    overhead_costs INTEGER NOT NULL
);