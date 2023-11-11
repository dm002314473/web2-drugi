const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const axios = require('axios');
const cors = require("cors");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Web2Projekt2',
  password: process.env.REACT_APP_PASSWORD,
  port: 5432,
  multipleStatements: true,
});

app.use(express.json()); 
app.use(cors(corsOptions))

app.get('/', (req, res) => {
  res.send("Hello world");
});

app.post('/api/xss-data', async (req, res) => {
  const { userInput } = req.body;
  const query = 'INSERT INTO web2projekt2 (stored_data) VALUES ($1)';
  const values = [userInput];
  console.log(query);
  try {
    await pool.query(query, values);
    res.status(201).send('Data stored successfully');
  } catch (error) {
    console.error('Error storing data:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/sensitive-data', async (req, res) => {
  const { name, oib } = req.body;
  const query = 'INSERT INTO web2projekt2_druga (name, oib) VALUES ($1, $2)';
  const values = [name, oib];
  try {
    await pool.query(query, values);
    res.status(201).send('Sensitive Data stored successfully');
  } catch (error) {
    console.error('Error storing sensitive data:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});