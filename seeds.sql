INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
VALUES
	("100% Whole Wheat Bread - 20oz", "Bakery", 2.99, 40, 7000),
    ("Jewish Seedless Rye Bread - 16oz", "Bakery", 3.79, 10, 3000),
    ("Dutch Country Premium Potato Bread - 22oz", "Bakery", 2.99, 10, 2000),
    ("Oranges - Navel - Medium - 1 each", "Produce", 0.79, 200, 4000),
    ("Potatoes - Sweet / Yams", "Produce", 0.87, 300, 6000),
    ("Banana", "Produce", 0.25, 600, 10000),
    ("Tomatoes - Red", "Produce", 0.73, 200, 4000),
    ("2% Reduced Fat Milk - 1 gal", "Dairy", 2.19, 40, 10000),
    ("Unsweetened Almond Milk - 1/2 gal", "Dairy", 2.99, 30, 4000),
    ("Mild Cheddar Shredded Cheese - 8oz", "Dairy", 1.88, 60, 8000);
    
INSERT INTO departments (department_name, overhead_costs)
VALUES
	("Bakery", 10000),
    ("Dairy", 20000),
    ("Produce", 20000);