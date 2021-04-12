const mysql = require('mysql');
const inquirer = require('inquirer');

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

const allEmployees = () => {
    const query = `select a.id, a.first_name, a.last_name, r.title, d.dept_name, r.salary, a.manager_id
        FROM employee as a
        join roles as r on a.role_id = r.id
        join department as d on r.department_id = d.id
        Order by a.id`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    });
};

const byDepartment = () => {
    inquirer
    .prompt({
      name: 'dept',
      type: 'list',
      message: 'Which department would you like to view?',
      choices: ['Engineering', "Sales", "Finance", "Marketing"]
    })
    .then((answer) => {
      const query = `select a.id, a.first_name, a.last_name, r.title, d.dept_name, r.salary, a.manager_id
      FROM employee as a
      join roles as r on a.role_id = r.id
      join department as d on r.department_id = d.id
      where d.dept_name = ?
      Order by a.id`;
      connection.query(query, [answer.dept], (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
      });
    }); 
}