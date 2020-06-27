INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Pablo", "Vazquez", 1, 2), ("John", "Doh", 2, 1), ("Jane", "Doe", 3, 2);

INSERT INTO roles (title, salary, department_id)
VALUES ("Manager", 300, 1), ("Engineer", 200, 2), ("Intern", 100, 3);

INSERT INTO departments (name)
VALUES ("Admin"), ("Engineering"), ("Education");