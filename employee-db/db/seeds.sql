USE the_office;
INSERT INTO departments (name)
VALUES ("Customer Service"),
       ("Accounting"),
       ("Sales"),
       ("Management"),
       ("Warehouse");

INSERT INTO roles (title, salary, department_id)
VALUES ("Customer Service Rep", 40,  1),
       ("Senior Accountant", 46, 2),
       ("Accountant", 42, 2),
       ("Sales Rep", 45, 3),
       ("Vice President", 200, 4),
       ("Regional Manager", 100, 4),
       ("Assistant to Regional Manager", 46, 4),
       ("Recepcionist", 38, 4),
       ("Warehouse Foreman", 40, 5);

INSERT INTO employees (first_name, last_name, role_id)
VALUES ("Ryan", "Howard", 5),
       ("Michael", "Scott", 6),
       ("Kelly", "Kapoor", 1),
       ("Angela", "Martins", 2),
       ("Kevin", "Malone", 3),
       ("Jim", "Halpert", 4),
       ("Phyllis", "Vance", 4),
       ("Dwight", "Schrute", 7),
       ("Pam", "Beesly", 8),
       ("Darryl", "Philbin", 9);