const mysql = require("mysql");
const inquirer = require("inquirer");
const password = require("dotenv").config();
const fs = require("fs");
//const db = require('db');
mysql.createConnection({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS
});

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: process.env.password,
  database: "bamazonDB"
});


// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  console.log("connected as id " + connection.threadId);
  start();
});

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "postOrbuy",
      type: "rawlist",
      message: "Would you like to [POST] an item or [BUY] an item?",
      choices: ["POST", "BUY"]
    })
    .then(function(answer) {
      // based on their answer, either call the buy or the post functions
      if (answer.postOrbuy.toUpperCase() === "POST") {
        postItem();
      }
      else {
        buyItem();
      }
    });
}
read = () => {
    fs.readFile("products.csv", "utf-8", function(err, data) {
      if (err) {
        console.log(err);
      }// console.log(data);
      // Then split it by commas (to make it more readable)
      let dataArr = data.split(",");
                for (let t = 0; t < dataArr.length; t++ ) {

        connection.query("INSERT INTO bamazonDB.products_post SET ? WHERE ?", function(err, dataArr) {
          //add loop to iterate array i
          product_name: dataArr[i]
          // category: dataArr,
          // product_name: answer.item,
          // price: answer.price,
          // stock_quantity: answer.quantity
         
        });
      }
        

      // We will then re-display the content as an array for later use.
      console.log(dataArr);    
    })
}
search = () => {
          let q = 
          connection.query("SELECT * FROM bamazonDB.products_buy", function(err, results) {
              if (err) throw err;
              return results;
  })
}

// function to handle posting new items up for item
function postItem() {
  // prompt for info about the item being put up for item
  inquirer
  .prompt([
    {
      name: "item",
      type: "input",
      message: "What is the item you would like to submit?"
    },
    {
      name: "category",
      type: "input",
      message: "What category would you like to place your item in?"
    },
    {
      name: "quantity",
      type: "input",
      message: "How many of these items are available for purchase?"
    },
    // {
      //   name: "department",
      //   type: "input",
      //   message: "What department does that category fall in?"
      // },
      {
        name: "price",
        type: "input",
        message: "What would you like your selling price to be?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO bamazonDB.products_post SET ?",
        {
          product_name: answer.item,
          category: answer.category,
          price: answer.price,
          stock_quantity: answer.quantity
          
        },
        function(err) {
          if (err) throw err;
          console.log("Your item was created successfully!");
          // re-prompt the user for if they want to buy or post
          start();
        }
      );
    });
}

function buyItem() {
  // query the database for all items being itemed
  connection.query("SELECT * FROM bamazonDB.products_post", function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to buy on
    inquirer.prompt([
        {
          name: "choice",
          type: "rawlist",
          choices: () => {
            connection.query("SELECT category FROM bamazonDB.products_post", function(err, results) {
              if (err) throw err;
              // return results;
              // console.log(results)
            }) 
            let choiceArray = [];
            for (let i = 0; i < results.length; i++) {
              choiceArray.push(results[i].category);
            }
            return [choiceArray];
          },
          name: "category",
          type: "rawlist",
          message: "Select Category",
          choices:  ["grocery", "auto", "apparel", "alcohol"]
          },
       {
          name: "item",
          message: "What item would you like to purchase?",
        
        },
        {
          name: "quantity",
          type: "input",
          message: "How many would you like to buy?"
        }
      ])
      .then(function(answer) {
        
          // based on their answer, either call the buy or the post functions 
          let selection =  ["grocery", "auto", "apparel", "alcohol"]
        for (let t = 0; t < selection.length; t++) {

          if (answer.category === selection[t]) {
            buyItem();
            // find category of db.products_post
          }
        }
      
        // get the information of the chosen item
        let chosenItem;
        for (let i = 0; i < results.length; i++) {
          if (results[i].product_name === answer.choice) {
            chosenItem = results[i];
          }
        }

        // determine what buyer wants and if purchase is possible
        //if (chosenItem === (answer.category)) {

        if (chosenItem > parseInt(answer.quantity)) {

            connection.query(
            "INSERT INTO bamazonDB.products_buy SET ?",
            [
              
              {
                category: answer.category,
                item: answer.product_name,
                quantity: answer.quantity
              },
              // {
              //   quantity: answer.quantity
              // },
              // {
              //   id: chosenItem.id
              // }
            ],
            function(error) {
              if (error) throw err;
              console.log("Purchase order placed successfully!");
              start();
            }
          );
          connection.query(
            "UPDATE bamazonDB.products_post SET ? WHERE ?",
            [
              
              {
                category: answer.category,
                item: answer.item,
                quantity: answer.quantity
              },
              // {
              //   quantity: answer.quantity
              // },
              // {
              //   id: chosenItem.id
              // }
            ],
            function(error) {
              if (error) throw err;
              console.log("Purchase order placed successfully!");
              start();
            }
          );
        }
      // }
        else {
          // out of stock
          console.log("Item Out Of Stock");
          start();
        }
      });
  });
}
