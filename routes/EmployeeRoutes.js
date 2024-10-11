const express = require('express');
const Employee = require('../models/EmployeesModel.js');
const routes = express.Router();

routes.use(express.json()); // Middleware to parse JSON requests

// Get all employees
routes.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).send({ message: err.message || 'Some error occurred while retrieving the employees.' });
  }
});

// Get employee by ID
routes.get('/employees/:employeeId', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.employeeId);
    if (!employee) {
      return res.status(404).send({ message: `Employee not found with id ${req.params.employeeId}` });
    }
    res.status(200).json(employee);
  } catch (err) {
    res.status(500).send({ message: `Error retrieving employee with id ${req.params.employeeId}` });
  }
});

// Create a new employee
routes.post('/employees', async (req, res) => {
  const { first_name, last_name, email, position, salary, date_of_joining, department } = req.body;

  if (!first_name || !last_name || !email || !position || !salary) {
    return res.status(400).send({ message: 'Missing required fields.' });
  }

  try {
    const newEmployee = new Employee({
      first_name,
      last_name,
      email,
      position,
      salary,
      date_of_joining,
      department,
      created_at: new Date(),
      updated_at: new Date()
    });

    const savedEmployee = await newEmployee.save();
    res.status(201).send({ message: 'Employee created successfully.', employee_id: savedEmployee._id });
  } catch (err) {
    res.status(500).send({ message: err.message || 'Error creating employee.' });
  }
});

// Update an employee by ID
routes.put('/employees/:employeeId', async (req, res) => {
  const { position, salary } = req.body;

  if (!position || !salary) {
    return res.status(400).send({ message: 'Position and salary are required' });
  }

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.employeeId,
      { position, salary, updated_at: new Date() },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).send({ message: `Employee not found with id ${req.params.employeeId}` });
    }

    res.send(updatedEmployee);
  } catch (err) {
    res.status(500).send({ message: `Error updating employee with id ${req.params.employeeId}` });
  }
});

// Delete an employee by ID
routes.delete('/employees', async (req, res) => {
  const employeeId = req.query.employeeId;
  try {
    const employee = await Employee.findByIdAndDelete(employeeId);
    if (!employee) {
      return res.status(404).send({ message: `Employee not found with id ${employeeId}` });
    }
    res.send({ message: 'Employee deleted successfully!' });
  } catch (err) {
    res.status(500).send({ message: `Error deleting employee with id ${employeeId}` });
  }
});

module.exports = routes;
