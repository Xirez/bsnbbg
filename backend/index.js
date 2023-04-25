require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const Sequelize = require('sequelize');
const db = require('./db');

const cors = require('cors');
const bodyParser = require('body-parser');

// JWT configuration
const jwt = require('jsonwebtoken');
app.set('jwtSecret', process.env.JWT_SECRET);
app.set('expiresIn', 3600000);
jwt.sign(
    {exp: Math.floor(Date.now() / 1000) + (60 * 60)}, 
    process.env.JWT_SECRET, 
    { algorithm: 'HS256' }, 
    function(err, token) {
    console.log(token);
});

// Routes
const usersRoutes = require('./routes/users');

// Models
const User = require('./models/User');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/users', usersRoutes);

// Sync models with the database
db.sync({ force: false, alter: true }).then(() => {
    console.log('Database is synced');
}).catch((error) => {
    console.error('Error syncing database:', error);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});