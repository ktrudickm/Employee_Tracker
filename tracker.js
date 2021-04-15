const mysql = require('mysql');
const inquirer = require('inquirer');




// Setting up mySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: 'root',
  // Be sure to update with your own MySQL password!
  password: 'Kendall88!',
  database: 'employeeDB',
});

connection.connect((err) => {
    if (err) throw err;
    start();
});

// Function to start the app and prompt the user for what type of action they would like to take
const start = () => {
    inquirer
      .prompt({
        name: 'action',
        type: 'rawlist',
        message: 'What would you like to do?',
        choices: [
          'View All Employees', "View All Employees by Department", "View All Employees by Manager", "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager"
        ],
      })
        .then((answer) => {
        switch (answer.action) {
            case 'View All Employees':
                allEmployees();
                break;
            case 'View All Employees by Department':
                byDepartment();
                break;
            case 'View All Employees by Manager':
                byManager();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Remove Employee':
                removeEmployee();
                break;
            case 'Update Employee Role':
                updateRole();
                break;
            case 'Update Employee Manager':
                updateManager();
                break;
            default:
                console.log(`Invalid action: ${answer.action}`);
                break;
        }
      });
};

// Displays all Employees
const allEmployees = () => {
    const query = `select a.id, a.first_name, a.last_name, r.title, d.dept_name, r.salary, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager
    from employee as a
    join roles as r on a.role_id = r.id
    join department as d on r.department_id = d.id
    left join employee e on a.manager_id = e.id
    Order by a.id`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
};

// Displays Employees by Department
const byDepartment = () => {
    inquirer
    .prompt({
      name: 'dept',
      type: 'list',
      message: 'Which department would you like to view?',
      choices: ['Engineering', "Sales", "Finance", "Marketing"]
    })
    .then((answer) => {
      const query = `select a.id, a.first_name, a.last_name, r.title, d.dept_name, r.salary, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager
      from employee as a
      join roles as r on a.role_id = r.id
      join department as d on r.department_id = d.id
      left join employee e on a.manager_id = e.id
      where d.dept_name = ?
      Order by a.id`;
      connection.query(query, [answer.dept], (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
      });
    }); 
};

// Displays the Employees by Manager
const byManager = () => {
    inquirer
    .prompt({
      name: 'manager',
      type: 'list',
      message: 'Which manager would you like to view?',
      choices: ['Kendall Trudick', "John Doe", "Sydney Riddle", "Sarah Lourd"]
    })
    .then((answer) => {
      const query = `select a.id, a.first_name, a.last_name, r.title, d.dept_name, r.salary, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager
      from employee as a
      join roles as r on a.role_id = r.id
      join department as d on r.department_id = d.id
      left join employee e on a.manager_id = e.id
      where CONCAT(e.first_name, ' ' ,e.last_name) like ?
      Order by a.id`;
      connection.query(query, [answer.manager], (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
      });
    }); 
};

// Adds employee to the database
async function addEmployee() {
  const query = `select a.id, a.first_name, a.last_name, r.title, d.dept_name, r.salary, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager
  from employee as a
  join roles as r on a.role_id = r.id
  join department as d on r.department_id = d.id
  left join employee e on a.manager_id = e.id
  WHERE a.manager_id is null
  Order by a.id`;




  const employee = await inquirer.prompt([{
    name: 'first_name',
    type: 'input',
    message: 'What is the first name of the Employee you would like to add?'
  },
  {
    name: 'last_name',
    type: 'input',
    message: 'What is the last name of the Employee you are adding?',
  }])
  
  
//get all the roles
    connection.query(' SELECT roles.id, roles.title, department.dept_name AS department, roles.salary FROM roles LEFT JOIN department on roles.department_id = department.id;', async (err, res) => {
    let roles = res.map(({id, title}) => (
         { name: title,
          value: id
         }
    ))


    const role = await inquirer.prompt([ {
      name: 'title',
      type: 'list',
      message: 'What is the role title of the employee?',
      choices: roles
    }])

    employee.role_id = role.title;
    console.log(employee)
 


 connection.query(query,  async (err, res) => {
  console.log(res)
  const managers = res.map(({id, first_name, last_name}) =>({


  name: `${first_name} ${last_name}`,
  value: id
  }))


    const manager = await inquirer.prompt( {
        name: 'manager',
        type: 'list',
        message: 'Who does this Employee report to?',
        choices: managers
    })
    

    employee.managerId = manager.manager;
    console.log(employee)
 })


})//first query 

};

// Removes Employee from the Database


// Updates an Employee's Role


// Updates an Employee's Manager
