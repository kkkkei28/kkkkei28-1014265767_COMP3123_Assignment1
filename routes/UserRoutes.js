const express = require('express');
const User = require('../models/UsersModel.js');
const routes = express.Router();
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator'); 
routes.use(express.json()); 


routes.post('/signup', [
    body('email').isEmail(),
    body('password').isLength({ min: 5 })
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      const newUser = new User({ username, email, password: hashedPassword });
      const savedUser = await newUser.save();
      res.status(201).json({ message: 'User created successfully.', user_id: savedUser._id });
    } catch (err) {
      res.status(500).json({ message: err.message || 'Some error occurred while creating the user.' });
    }
  });
  
  // Login Endpoint
  routes.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send({ message: 'Invalid credentials' });
      }
  
      res.status(200).send({ message: 'Login successful.' });
    } catch (err) {
      res.status(500).send({ message: err.message || 'An error occurred during login.' });
    }
  });
  
  module.exports = routes;
