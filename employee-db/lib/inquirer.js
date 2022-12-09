const db = require("../db/connection");
const cTable = require('console.table');
const inquirer = require("inquirer");

const viewEmployees = () => {
  const sql = `SELECT employees.id, 
               employees.first_name, 
               employees.last_name,
               roles.title AS title,
               roles.salary AS salary,
               departments.name,
               CONCAT (manager.first_name, " ", manager.last_name) AS manager 
               FROM employees
               LEFT JOIN roles ON employees.role_id = roles.id
               LEFT JOIN departments ON roles.department_id = departments.id
               LEFT JOIN employees manager ON employees.manager_id = manager.id`;
  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
    console.log("\n");
    console.table(rows);
    return startInquirer();
  });
};

const addEmployee = () => {
  
  return inquirer.prompt([
    {
      type: "input",
      name: "firstName",
      message: "What is the employee's first name?",
      validate: nameInput => {
        if (nameInput) {
          return true;
        } else {
          return false;
        };
      }
    },
    {
      type: "input",
      name: "lastName",
      message: "What is the employee's last name?",
      validate: nameInput => {
        if (nameInput) {
          return true;
        } else {
          return false;
        };
      }
    }
  ]).then (answer => {
    const params = [answer.firstName, answer.lastName];
    const sql = `SELECT * FROM roles`;

    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }

    const roles = rows.map(({title, id}) => ({name: title, value: id}));
    
    inquirer.prompt([
      {
        type: "list",
        name: "role",
        message: "What is the role of the employee?",
        choices: roles
      }]).then(roleAnswer => {
        const role = roleAnswer.role;
        params.push(role);
        const sql = `SELECT * FROM employees`;

        db.query(sql, (err, rows) => {
          if (err) {
            throw err;
          }

    const managers = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
    managers.push({name: "No manager", value: null});
    
    inquirer.prompt([
      {
        type: "list",
        name: "manager",
        message: "Who is the employee's manager?",
        choices: managers
      }]).then(managerAnswer => {
        const manager = managerAnswer.manager;
        params.push(manager);
        const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                     VALUES (?, ?, ?, ?)`;
        
        db.query(sql, params, (err) => {
          if (err) {
            throw err;
            }
              console.log("\n");
              console.log("employee added");
              return viewEmployees();
           });
         });
       });
     });
   });
 });
};

const updateEmployeeRole = () => {
  const sql = `SELECT first_name, last_name, id FROM employees`

  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
    }
  const employees = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
  
  inquirer.prompt([
    {
      type: "list",
      name: "employee",
      message: "Which employee's role do you want to update?",
        choices: employees
      }
    ])
    .then(employeeAnswer => {
      const employee = employeeAnswer.employee;
      const params = [employee];
      const sql = `SELECT title, id FROM roles`;
      db.query(sql, (err, rows) => {
        if (err) {
          throw err;
        }
        const roles = rows.map(({title, id}) => ({name: title, value: id}));
        inquirer.prompt([
          {
            type: "list",
            name: "role",
            message: "What is the new role of the employee?",
            choices: roles
          }
        ])
        .then(rolesAnswer => {
          const role = rolesAnswer.role;
          params.unshift(role);
          const sql = `UPDATE employees
                        SET role_id = ?
                        WHERE id = ?`
          db.query(sql, params, (err) => {
            if (err) {
              throw err;
            }
            console.log("\n");
            console.log("employee updated");
            return viewEmployees();
          });
        });
      });
    });
  });
};

const viewRoles = () => {
  const sql = `SELECT roles.id, 
               roles.title, 
               roles.salary, 
               departments.name AS department
               FROM roles
               LEFT JOIN departments ON roles.department_id = departments.id`;
  
  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
      }
      console.log("\n");
      console.table(rows);
      return startInquirer();
    });
  };

const addRole = () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "What is the name of the role?",
      validate: nameInput => {
        if (nameInput) {
          return true;
          } else {
            return false;
          };
        }
    },
    {
      type: "input",
      name: "salary",
      message: "What is the salary of the role?",
      validate: salaryInput => {
        if (isNaN(salaryInput)) {
            return false;
          } else {
            return true;
            
          };
        }
    }]).then (answer => {
      const params = [answer.title, answer.salary];
      const sql = `SELECT * FROM departments`;

      db.query(sql, (err, rows) => {
        if (err) {
          throw err;
        }

      const departments = rows.map(({name, id}) => ({name: name, value: id}));

      inquirer.prompt([
        {
          type: "list",
          name: "department",
          message: "Which department does the role belong to?",
          choices: departments
        }]).then(departmentAnswer => {
          const department = departmentAnswer.department;
          params.push(department);
          const sql = `INSERT INTO roles (title, salary, department_id)
            VALUES (?, ?, ?)`;

          db.query(sql, params, (err) => {
            if (err) {
              throw err;
            }

            console.log("\n");
            console.log("role added");

            return viewRoles();
          });
        });
      });
    });
  };

const viewDepartments = () => {
  const sql = `SELECT * FROM departments`;
  
  db.query(sql, (err, rows) => {
    if (err) {
      throw err;
      }
      console.log("\n");
      console.table(rows);
      return startInquirer();
      });
    };

const addDepartment = () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is the name of the department?",
      validate: nameInput => {
        if (nameInput) {
          return true;
        } else {
          return false;
        };
      }
    }
  ]).then(answer => {
    const sql = `INSERT INTO departments (name)
                 VALUES (?)`;
    const params = answer.name;
    
    db.query(sql, params, (err) => {
      if (err) {
        throw err;
      }

      console.log("\n");
      console.log("department added");
      return viewDepartments();
    });
  });
};

const startInquirer = () => {
  
inquirer.prompt([
  {
    type: "list",
    name: "toDo",
    message: "What would you like to do?",
    choices: [
      "View All Employees",
      "Add Employee",
      "Update Employee Role",
      "View All Roles",
      "Add Role",
      "View All Departments",
      "Add Department",
      "Quit"
      ]
  }]).then(answers => {
    
    const nextPrompt = answers.toDo;

    if (nextPrompt === "View All Employees") {
      viewEmployees();
      };
      
    if (nextPrompt === "Add Employee") {
      addEmployee();
      };
    
    if (nextPrompt === "Update Employee Role") {
      updateEmployeeRole();
      };
    
    if (nextPrompt === "View All Roles") {
      viewRoles();
      };
    
    if (nextPrompt === "Add Role") {
      addRole();
      };
    
    if (nextPrompt === "View All Departments") {
      viewDepartments();
      };
   
    if (nextPrompt === "Add Department") {
      addDepartment();
      };

    if (nextPrompt === "Quit") {
      process.exit();
      };
  })};

  module.exports = startInquirer;