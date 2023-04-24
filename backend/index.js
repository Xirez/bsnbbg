const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;
const Sequelize = require('sequelize');
const db = require('./db');

// Models
const User = require('./models/User');

app.use(cors());
app.use(bodyParser.json());

app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Sync models with the database
db.sync({ force: false, alter: true }).then(() => {
    console.log('Database is synced');
}).catch((error) => {
    console.error('Error syncing database:', error);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});