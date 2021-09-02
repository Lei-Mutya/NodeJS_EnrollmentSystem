const express = require('express');
const router = express.Router();
const mysql = require('mysql');

//start database
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

//MAINPAGE
router.get('/', (req, res) => {
  res.render('index');
});

//STUDENT REGISTRATION
router.get('/register', (req, res) => {
  res.render('register');
});

//ADMIN REGISTRATION
router.get('/registerAdmin', (req, res) => {
  res.render('registerAdmin');
});

//STUDENT LOGIN
router.get('/loginStudent', (req, res) => {
  res.render('loginStudent');
});

//ADMIN LOGIN
router.get('/loginAdmin', (req, res) => {
  res.render('loginAdmin');
});

//STUDENT PAGE
router.get('/studentPage', (req, res) => {
  res.render('studentPage');
});

//ADMIN PAGE
router.get('/adminPage', (req, res) => {
  res.render('adminPage');
});

//VIEW STUDENTS
router.get('/viewStudents', function (req, res, next) {
  db.query('SELECT * FROM tbl_login_users', function (err, data, fields) {
    if (err) throw err;
    res.render('viewStudents', { title: 'LIST OF STUDENTS', userData: data });
  });
});

//EDIT STUDENTS
router.get('/editStudent', (req, res) => {
  res.render('editStudent');
});

module.exports = router;
