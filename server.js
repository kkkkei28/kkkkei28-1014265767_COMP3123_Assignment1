const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./routes/UserRoutes');
const employeeRoutes = require('./routes/EmployeeRoutes');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.Promise = global.Promise;

//  have to change 
const DB_URL = 'mongodb+srv://keiqueue:Queue112830!@cluster0.3jw30.mongodb.net/comp3123_assignment1?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Successfully connected to the MongoDB server');
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

// Use routes from UserRoutes and EmployeeRoutes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp', employeeRoutes);

// Default Route
app.get('/', (req, res) => {
    res.send('<h1>Welcome to the Full Stack Development Assignment 1</h1>');
});

const SERVER_PORT = 3000;

app.listen(SERVER_PORT, () => {
    console.log(`Server running at http://localhost:${SERVER_PORT}/`);
});
