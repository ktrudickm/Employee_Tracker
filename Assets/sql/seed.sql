INSERT INTO employee 
(id, first_name, last_name, role_id, manager_id)
VALUES
(1,"Kendall", "Trudick", 1, null),
(2,"Cassie", "Gerzeny", 6, 1),
(3,"Sam", "Dover", 3, 4),
(4,"John", "Doe", 2, null),
(5,"Kevin", "Baxter", 5, 6),
(6,"Sydney", "Riddle", 4, null),
(7,"Gabby","Redmond",8,8),
(8,"Sarah", "Lourd", 7, null);
select * from employee;

INSERT INTO department 
(id, dept_name)
VALUES
(1,"Engineering"),
(2,"Sales"),
(3,"Marketing"),
(4,"Finance");
select * from department;

INSERT INTO roles 
(id, title, salary, department_id)
VALUES
(1,"Lead Engineer",150000,1),
(2,"Sales Lead",100000,2),
(3,"Sales Person",100000,2),
(4,"Finance Lead",120000,4),
(5,"Accountant",95000,4),
(6,"Software Engineer",140000,1),
(7,"Marketing Lead",110000,3),
(8,"Marketing Specialist",90000,3);
select * from roles;

SELECT a.id, a.first_name, a.last_name, r.title, d.dept_name, r.salary, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager
from employee as a
join roles as r on a.role_id = r.id
join department as d on r.department_id = d.id
left join employee e on a.manager_id = e.id
where CONCAT(e.first_name, ' ' ,e.last_name) like 'Kendall Trudick'
Order by a.id;