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
          'View All Employees', "View All Employees by Department", "View All Employees by Manager", "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager", "Add Department", "Add a Role", "View all Employees by Role"
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
            case 'Add Department':
                addDepartment();
                break;
            case 'Add a Role':
                addRole();
                break;
            case 'View all Employees by Role':
                viewRoles();
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
      { 
        name: title,
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
 


 connection.query(query,  async (err, res) => {
    const managers = res.map(({id, first_name, last_name}) =>(
      {
        name: `${first_name} ${last_name}`,
        value: id
      }
    ));


    const manager = await inquirer.prompt( {
        name: 'manager',
        type: 'list',
        message: 'Who does this Employee report to?',
        choices: managers
    })
    

    employee.managerId = manager.manager;

    const queryAdd = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (?, ?, ?, ?)`;
   
    connection.query(queryAdd, [employee.first_name, employee.last_name, employee.role_id, employee.managerId], async (err, res) => {
      if (err) throw err;
      console.log("Employee Successfully Added!");
      start();
    });
 })
})
};

// Removes Employee from the Database
async function removeEmployee() {

  connection.query(`SELECT * FROM employee;`, async (err, res) => {
    let allEmployees = res.map(({id, first_name, last_name}) => (
      {
        name: `${first_name} ${last_name}`,
        value: id
      }
    ))


  const employee = await inquirer.prompt([{
    name: 'emp',
    type: 'list',
    message: 'What is the name of the Employee you would like to remove?',
    choices: allEmployees
  },
  ])

  let removeEmp = employee.emp;

  const query = `DELETE from employee WHERE id = ?`;

  connection.query(query, [removeEmp], async (err, res) => {
    if (err) throw err;
    console.log('Employee successfully removed!');
    start();
  })

  })
}


// Updates an Employee's Role
async function updateRole() {

  connection.query(`SELECT * FROM employee;`, async (err, res) => {
    let allEmployees = res.map(({id, first_name, last_name}) => (
      {
        name: `${first_name} ${last_name}`,
        value: id
      }
    ))


  const employee = await inquirer.prompt([{
    name: 'emp',
    type: 'list',
    message: 'What is the name of the Employee you would like to update the role for?',
    choices: allEmployees
  },
  ])

  let updateEmp = employee.emp;

  connection.query(' SELECT roles.id, roles.title, department.dept_name AS department, roles.salary FROM roles LEFT JOIN department on roles.department_id = department.id;', async (err, res) => {
    let roles = res.map(({id, title}) => (
      { 
        name: title,
        value: id
      }
    ))


    const role = await inquirer.prompt([ {
      name: 'title',
      type: 'list',
      message: 'What is the new role title of the employee?',
      choices: roles
    }])

    let newRole = role.title;


  const query = `UPDATE employee
    SET role_id = ?
    WHERE id = ?;`;

  connection.query(query, [newRole, updateEmp], async (err, res) => {
    if (err) throw err;
    console.log('Employee role successfully updated!');
    start();
  })

  })
})
}


// Updates an Employee's Manager
async function updateManager() {
  const query = `select a.id, a.first_name, a.last_name, r.title, d.dept_name, r.salary, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager
  from employee as a
  join roles as r on a.role_id = r.id
  join department as d on r.department_id = d.id
  left join employee e on a.manager_id = e.id
  WHERE a.manager_id is null
  Order by a.id`;

  connection.query(`SELECT * FROM employee;`, async (err, res) => {
    let allEmployees = res.map(({id, first_name, last_name}) => (
      {
        name: `${first_name} ${last_name}`,
        value: id
      }
    ))


    const employee = await inquirer.prompt({
      name: 'emp',
      type: 'list',
      message: 'What is the name of the Employee you would like to update the manager for?',
      choices: allEmployees
    }
    )

    let updateEmp = employee.emp;

  
    connection.query(query,  async (err, res) => {
      const managers = res.map(({id, first_name, last_name}) => (
        {
          name: `${first_name} ${last_name}`,
          value: id
        }
      ));


    const manager = await inquirer.prompt( {
        name: 'manager',
        type: 'list',
        message: "Who would you like the Employee's new manager to be?",
        choices: managers
    })
    

    let newManager = manager.manager;

    const queryUp = `UPDATE employee
    SET manager_id = ?
    WHERE id = ?;`;

  connection.query(queryUp, [newManager, updateEmp], async (err, res) => {
    if (err) throw err;
    console.log('Employee role successfully updated!');
    start();
  })

  })
  })
}

// Add a department
const addDepartment = () => {
  inquirer
  .prompt({
    name: 'dept',
    type: 'input',
    message: 'What is the name of the department you would like to add?',
  })
  .then((answer) => {
    const query = `INSERT INTO department (dept_name) 
    VALUES (?)`;
    connection.query(query, [answer.dept], (err, res) => {
      if (err) throw err;
      console.log('Department Successfully Added!')
      start();
    });
  }); 
};

// Add a role
async function addRole() {

  const role = await inquirer.prompt({
    name: 'role',
    type: 'input',
    message: 'What is the title of the role you would like to add?'
  })
  
  
//get all the departments
  connection.query(' SELECT department.id, department.dept_name from department', async (err, res) => {
    let depts = res.map(({id, dept_name}) => (
      { 
        name: dept_name,
        value: id
      }
    ))


    const department = await inquirer.prompt([ {
      name: 'title',
      type: 'list',
      message: 'What is department does this role fall under?',
      choices: depts
    }])

    role.department_id = department.title;

 
   
    const salary = await inquirer.prompt( {
        name: 'salary',
        type: 'input',
        message: 'What is the salary of this role?'
    })
    

    const queryAdd = `INSERT INTO roles (title, salary, department_id)
    VALUES (?, ?, ?)`;
   
    connection.query(queryAdd, [role.role, salary, role.department_id], async (err, res) => {
      if (err) throw err;
      console.log("Role Successfully Added!");
      start();
    });
 })
};

// View all employees by role
async function viewRoles() {

//get all the roles
  connection.query(' SELECT roles.title, roles.id from roles', async (err, res) => {
    let roles = res.map(({id, title}) => (
      { 
        name: title,
        value: id
      }
    ))

    const role = await inquirer.prompt([ {
      name: 'title',
      type: 'list',
      message: 'What is department does this role fall under?',
      choices: roles
    }])

    console.log(role);

    const query = `select a.id, a.first_name, a.last_name, r.title, d.dept_name, r.salary, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager
    from employee as a
    join roles as r on a.role_id = r.id
    join department as d on r.department_id = d.id
    left join employee e on a.manager_id = e.id
    where r.id = ?
    Order by a.id`;
   
    connection.query(query, [role.title], async (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    });
  })
}
