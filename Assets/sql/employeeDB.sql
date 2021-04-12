DROP DATABASE IF EXISTS employeeDB;
CREATE DATABASE employeeDB;
USE employeeDB;

CREATE TABLE employee
(
  id INT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id decimal(10,3) NULL,
  PRIMARY KEY(id)
);

CREATE TABLE department
(
  id INT NOT NULL,
  dept_name VARCHAR(30) NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE role
(
  id INT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary decimal not null,
  department_id INT NOT NULL,
  PRIMARY KEY(id)
);


