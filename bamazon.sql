DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products_post (
  id INTEGER NOT NULL AUTO_INCREMENT,
  category VARCHAR(45) NOT NULL,
  product_name VARCHAR(45) NULL,
  -- department_name VARCHAR(45) NULL,
  price DECIMAL(10,2) NULL,
  -- quantity INT NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE products_buy (
  id INTEGER NOT NULL AUTO_INCREMENT,
  category VARCHAR(45) NOT NULL,
  product_name VARCHAR(45) NULL,
  -- department_name VARCHAR(45) NULL,
  price DECIMAL(10,2) NULL,
  quantity INT NULL,
  -- stock_quantity INT NULL,
  PRIMARY KEY (id)
);


INSERT INTO products_post (category, product_name, price, stock_quantity)
VALUES ("groceries", "bread", "bakery", 6.20, 10 );

INSERT INTO products_buy (category, product_name, price, quantity)
VALUES ("groceries", "bread", , 6.20, 10 );