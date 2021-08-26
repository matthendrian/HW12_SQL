//command line login:   mysql --user=root -p
//if mysql isn't downloaded in right path: export PATH=$PATH:/usr/local/mysql/bin


const inquirer = require('inquirer');
const fs = require('fs');
const util = require('util');
const mysql = require('mysql2');


//assigns the local port. 
const PORT = process.env.PORT || 3306;


//connects to the database using my login credentials created for this project.
const db = mysql.createConnection(
    {
      port: 3306,
      host: 'localhost',
      user: 'root',
      password: 'Matt4221!',
      database: 'employees_db'
    },
    console.log(`Connected to the employee database.`)
);


//ChooseAction is the starter function. 
const chooseAction = () => {
  return inquirer.prompt ([
    {
      type: 'list',
      name: 'action',
      message: "Please choose what you would like to do",
      choices: ['View all departments', 'View all roles', 'view all employees', 'Add a department', 'Add a role', 'Update employee roel']
    },
    ]).then(function(answer){
        // fire a different inquirer function within this one if it applies. 
        if (answer.action == "View all departments") {
            ViewAllDepartments();
            //console.log("Test case 1 working!"); 
        } else if (answer.action ==="View all roles") {
             ViewAllRoles();
             //console.log("Test case 2 working!"); 
        } else if (answer.action == "view all employees"){
            ViewAllEmployees();
            //console.log("Test case  3 working!"); 
        } else if (answer.action == 'Add a department'){
            addDepartment();
            //console.log("Test case 4 working!"); 
        } else if (answer.action == 'Add a role'){
           addRole();

            
        } else if (answer.action == 'Update employee roel'){
          updateEmployeeRole();
        }


    })

};

//fires after the query ends, and restarts the prompt if user selects yes. 
addMore = () => {
  return inquirer.prompt({
    type: 'list',
    name: 'addMore',
    message:'Would you like to make another selection?',
    choices: ['Yes','No']

  }) .then(function (answer) {
    if (answer.addMore == "Yes") {
      //fires the initial action prompt
      chooseAction();
  } else if (answer.action == "No") {
       //shows the current table. 
       console.log('Goodbye!');
  
  }
    
  })
}
//adds a role to the db
addRole = () => {
  inquirer.prompt({
    type: 'input',
    name: 'newRole',
    message: "Please Enter the role name",
    // choices: ['Firing']
    },
    //there is an issue firing the second question. Let's see if we can troubleshoot. 
    {
    type: 'input',
    name: 'newPay',
    message: "Please Enter the salary of the role",

  }
  ).then(function(answer) {
    //changed connection to db query.
    db.query(`INSERT INTO role (name) VALUES ('${answer.newRole}')`, (err, res) => {
      //console.log("added: " + answer.newRole)
      console.table("added: " + answer.newRole);
      //fires the first function again if user wants more changes. 
      addMore();
    }) 
  })
};

//TEMPLATE FOR QUERYING DB. 
//1) NEED TO DECIDE FUNCTION (CREATE,READ,UPDATE, OR DELETE.)
//2) TIE ID TO DATA ITEM.
//3) SHOW UPDATED LIST.


var addDepartment = () => {
    return inquirer.prompt([
      {
        name: "department",
        type: "input",
        message: "What department would you like to add?"
      }
    ]).then(function(answer) {
      //department is the response var. Change it. 
      db.query(`INSERT INTO department (name) VALUES ('${answer.department}')`, (err, res) => {
        if (err) throw err;
        //console.log("added: " + answer.department);
        console.table("added: " + answer.department);
  
      }) 
      addMore();
    })
};

var ViewAllDepartments = () => {
  db.query("SELECT id, name FROM department", (err,res) => {
    if (err) throw err;
     // console.log('Firing view all departments');
     allDepts = res;
     //console.log(allDepts);
     console.table(allDepts);
  })
  addMore();
  
};
//Ensure SQL table is built properly!
var ViewAllRoles = () => {
  db.query("SELECT id, title FROM role", (err,res) => {
    if (err) throw err; 
    // console.log('Firing view all roles');
    roles = res;
    //console.log(roles);
    console.table(roles);
  })
  addMore();
};
//Shows all employees.
var ViewAllEmployees = () => {
  db.query("SELECT id, CONCAT_WS(' ', first_name, last_name) AS Employee_Name FROM employee", (err,res) => {
    if (err) throw err;
    // console.log('Firing view all employees!');
    employees = res;
    //console.log(employees);
    console.table(employees);
  })
  addMore();
};

var updateEmployeeRole = () => {
   // db.query
   console.log('Firing Update Employee Role!')

   addMore();
}
  
//Fires inquirer prompt. 
chooseAction();

//Shows the current database.
//console.log(db);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
