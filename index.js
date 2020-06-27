// IMPORTING NPM PACKAGES WE NEED TO HAVE PATHS TO URL AND EXPRESS FRAMEWORK
const mysql = require("mysql");
const cTable = require('console.table');
const inquirer = require ('inquirer'); 
// SETTING UP CONNECTION TO BE ABLE TO CONNECT WITH MYSQL WORKBENCH.
const connection = mysql.createConnection({ 
  host: "localhost",  
  port: 3306,
  user: "root",
  password: "",
  database: "employee_DB"
});
// CONNECTING TO WORKBENCH THEN RUNNING THE START FUNCTION.
connection.connect((err) =>{
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  start(); 
});
// FUNCTION THAT BEGINS TO PROMPT USER WITH CHOICES.
const start = () => {
  inquirer
  .prompt ([
    {
      type: "list", 
      message: "Please select from options below:",
      name: "start",
      choices: [
      "Add Employee", 
      "View all Employees", 
      "Remove Employee",
      "Add Department", 
      "View all Departments",
      "Add Roles", 
      "View all Roles",  
      "Exit"
    ]
    }
  ])
 // TAKING IN USER INPUT AND THEN PASSING IT INTO A SWITCH STATEMENT.
  .then ((res) => {
    switch (res.start){
      case "Add Employee":
 // DEPENDING ON USER INPUT, ITS CORRESPONDING FUNCTION WILL BE CALLED.       
      addEmployee();
      break;
      case "View all Employees":
      viewEmployees();
      break; 
      case "Remove Employee": 
      removeEmployee(); 
      break;
      case "Add Department": 
      addDepartment(); 
      break;
      case "View all Departments":
      viewDepartments();
      break;
      case "Add Roles": 
      addRole(); 
      break;
      case "View all Roles": 
      viewRoles(); 
      break;
      case "Exit":
      connection.end(); 
      break; 
    }
  })
}
 // ONE OF THE FUNCTIONS TO BE CALLED IF ADD EMPLOYEE IS SELECTED PROMPTING ITS OWN QUESTIONS. 
const addEmployee = () => {
console.log("Inserting a new employee.\n");
inquirer 
  .prompt ([ 
    {
      type: "input", 
      message: "First Name?",
      name: "first_name",
    },
    {
      type: "input", 
      message: "Last Name?",
      name: "last_name"
    },
    {
      type: "list",
      message: "What is the employee's role?",
      name: "role_id", 
      choices: [1,2,3]
    },
    {
      type: "input", 
      message: "Who is their manager?",
      name: "manager_id"
    }
  ])
 // PASSING IN USER RESPONSE THEN CONNECTING TO MYSQL TO PASS IN QUERY.
  .then ((res) => {
    const query = connection.query(
      "INSERT INTO employees SET ?", 
     res,
      function(err, res) {
        if (err) throw err;
        console.log( "Employee added!\n");
 // RETURNING TO START FUNCTION ONCE COMPLETE.
        start (); 
      }
    );    
  })
}
const viewEmployees = () => {
  connection.query(`SELECT employees.first_name, 
  employees.last_name, 
  roles.title AS "role", 
  managers.first_name AS "manager" FROM employees 
  LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN 
  employees managers ON employees.manager_id = managers.id GROUP BY employees.id`,  
  (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
}
const removeEmployee = () => {
  let employeeList = [];
  connection.query(
    "SELECT employees.first_name, employees.last_name FROM employees", (err,res) => {
      for (let i = 0; i < res.length; i++){
        employeeList.push(res[i].first_name + " " + res[i].last_name);
      }
  inquirer 
  .prompt ([ 
    {
      type: "list", 
      message: "Which employee would you like to delete?",
      name: "employee",
      choices: employeeList
    },
  ])
  .then ((res) => {
    const query = connection.query(
      `DELETE FROM employees WHERE concat(first_name, ' ' ,last_name) = '${res.employee}'`,
        function(err, res) {
        if (err) throw err;
        console.log( "Employee deleted!\n");
     start();
    });
    });
    }
      );
      };
const addDepartment = () => {
  inquirer
  .prompt([
    {
      type: "input",
      name: "deptName", 
      message: "What Department would you like to add?"
    }
  ])
  .then((res) => {
    console.log(res);
    const query = connection.query(
      "INSERT INTO departments SET ?", 
      {
        name: res.deptName
      }, 
      (err, res) => {
        connection.query("SELECT * FROM departments", function(err, res){
          console.table(res); 
          start(); 
        })
      }
    )
  })
}
const viewDepartments = () => {
connection.query ("SELECT * FROM departments", function(err, res){
  console.table(res);
  start();
})
}
const addRole = () => {
  let departments= []; 
connection.query("SELECT * FROM departments",
(err,res) => {
  if(err) throw err;
  for (let i=0; i <res.length; i++){
    res[i].first_name + " " + res[i].last_name
    departments.push({name: res[i].name, value: res[i].id});
  }
inquirer
.prompt([
  {
    type: "input", 
    name: "title",
    message: "What role would you like to add?"
  },
  {
    type: "input",
    name: "salary",
    message: "What is the salary for the role?"
  },
  {
    type: "list",
    name: "department",
    message: "what department?",
    choices: departments
  }
])
.then ((res) => {
  console.log(res); 
  const query = connection.query(
    "INSERT INTO roles SET ?",
    {
      title: res.title,
      salary: res.salary,
      department_id: res.department
    }, 
     (err, res) => {
      if (err) throw err;
      start(); 
    }
  )
})
})
}
const viewRoles = () => {
  connection.query(`SELECT roles.*,
   departments.name 
   FROM roles LEFT JOIN 
   departments ON departments.id = roles.department_id`, 
    (err,res) => {
    if (err) throw err;
    console.table(res);
    start();
  }
  )};

