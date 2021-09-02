const express = require('express');
const path = require('path');
const mysql = require('mysql');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config({
  path: './.env',
});

const app = express();
//start database
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

//Parsing URL encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
//Parsing JSON bodies (as sent by API clients)
app.use(express.json());

//initialize cookie parser
app.use(cookieParser());

app.set('view engine', 'hbs');

db.connect(error => {
  if (error) {
    console.log(error);
  } else {
    console.log('MYSQL Connected . . .');
  }
});

//Define routes

app.use('/', require('./routes/Pages'));
app.use('/auth', require('./routes/Auth'));

app.listen(3002, () => {
  console.log('Server started on port 3001');
});
