const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { result } = require('lodash');

//start database
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

//LOGIN STUDENT
exports.loginStudent = async (req, res) => {
  try {
    //if there's no error
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).render('loginStudent', {
        message: 'Please provide a correct username and/or password',
      });
    }
    db.query(
      'SELECT * FROM tbl_login_users WHERE username=?',
      [username],
      async (error, results) => {
        console.log(results);

        //bcrcypt compare the login and the db
        if (!results || (await bcrypt.compare(password, results[0].password))) {
          res.status(401).render('loginStudent', {
            message: 'Username and/or Password is incorrect',
          });
        } else {
          const id = results[0].id;
          const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
          });
          console.log('The token is' + token);
          const cookieOptions = {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
          };
          res.cookie('jwt', token, cookieOptions);
          res.status(200).redirect('/studentPage');
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

//REGISTRATION ADMIN
exports.registerAdmin = (req, res) => {
  console.log(req.body);

  const {
    adminFname,
    adminMname,
    adminLname,
    adminEmail,
    adminCon,
    usernameAd,
    password_ad,
    passwordConfirm,
  } = req.body;

  //querrying in the database
  db.query(
    'SELECT admin_email FROM tbl_admin_users WHERE admin_email=?',
    [adminEmail],
    async (error, results) => {
      if (error) {
        console.log(error);
      }
      if (results.length > 0) {
        return res.render('registerAdmin', {
          message: 'That email is already in use',
        });
      } else if (password_ad !== passwordConfirm) {
        return res.render('registerAdmin', {
          message: 'Passwords do not match',
        });
      }

      //decrypt passwords
      let hashedPasswordAdmin = await bcrypt.hash(password_ad, 8);
      console.log(hashedPasswordAdmin);
      //res.send('testing');

      db.query(
        'INSERT INTO tbl_admin_users SET ?',
        {
          //database: name
          admin_firstname: adminFname,
          admin_middlename: adminMname,
          admin_lastname: adminLname,
          admin_email: adminEmail,
          admin_con: adminCon,
          username_ad: usernameAd,
          password_ad: hashedPasswordAdmin,
        },
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            return res.render('register', {
              message: 'Successfully Admin registration!',
            });
          }
        }
      );
    }
  );
  //res.send('Form submitted');
};

//LOGIN ADMIN
exports.loginAdmin = async (req, res) => {
  try {
    //if there's no error
    const { usernameAd, password_ad } = req.body;
    if (!usernameAd || !password_ad) {
      return res.status(400).render('loginAdmin', {
        message: 'Please provide a correct username and/or password',
      });
    }
    db.query(
      'SELECT * FROM tbl_admin_users WHERE username_ad=?',
      [usernameAd],
      async (error, results) => {
        console.log(results);

        //bcrcypt compare the login and the db
        if (
          !results ||
          (await bcrypt.compare(password_ad, results[0].password_ad))
        ) {
          res.status(401).render('loginAdmin', {
            message: 'Username and/or Password is incorrect',
          });
        } else {
          const id = results[0].id;
          const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
          });
          console.log('The token is' + token);
          const cookieOptions = {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
          };
          res.cookie('jwt', token, cookieOptions);
          res.status(200).redirect('/adminPage');
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

//REGISTRATION STUDENT
exports.register = (req, res) => {
  console.log(req.body);

  const {
    firstname,
    middlename,
    lastname,
    address,
    contactNum,
    emailAdd,
    course,
    username,
    password,
    passwordConfirm,
  } = req.body;

  //querrying in the database
  db.query(
    'SELECT email FROM tbl_login_users WHERE email=?',
    [emailAdd],
    async (error, results) => {
      if (error) {
        console.log(error);
      }
      if (results.length > 0) {
        return res.render('register', {
          message: 'That email is already in use',
        });
      } else if (password !== passwordConfirm) {
        return res.render('register', {
          message: 'Passwords do not match',
        });
      }

      //decrypt passwords
      let hashedPassword = await bcrypt.hash(password, 8);
      console.log(hashedPassword);
      //res.send('testing');

      db.query(
        'INSERT INTO tbl_login_users SET ?',
        {
          firstname: firstname,
          middlename: middlename,
          lastname: lastname,
          address: address,
          contact_no: contactNum,
          email: emailAdd,
          course: course,
          username: username,
          password: hashedPassword,
        },
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            return res.render('register', {
              message: 'Successfully registered',
            });
          }
        }
      );
    }
  );
  //res.send('Form submitted');
};

exports.editStudent = (req, res) => {
  const email = req.params.email;
  db.query(
    'SELECT * from tbl_login_users WHERE email=?',
    [email],
    (err, results) => {
      if (err) throw err;
      res.render('editStudent', { title: 'Edit Student', user: results[0] });
    }
  );
};

exports.updateStudent = (req, res) => {
  const {
    firstname,
    middlename,
    lastname,
    address,
    contactNum,
    emailAdd,
    username,
  } = req.body;

  db.query(
    `UPDATE tbl_login_users SET firstname='${firstname}',middlename='${middlename}',lastname='${lastname}',address='${address}', contact_no='${contactNum}', email='${emailAdd}', username='${username}' WHERE email='${emailAdd}'`,
    (err, results) => {
      if (err) throw err;
      db.query('SELECT * FROM tbl_login_users', (err, results) => {
        res.redirect('/viewStudents');
      });
    }
  );
};

exports.deleteStudent = (req, res) => {
  const email = req.params.email;
  db.query(
    'SELECT * from tbl_login_users WHERE email=?',
    [email],
    (err, results) => {
      if (err) throw err;
      res.render('deleteStudent', {
        title: 'Delete Student',
        user: results[0],
      });
    }
  );
};

exports.deletedStudent = (req, res) => {
  db.query(
    'DELETE FROM tbl_login_users  WHERE email=?',
    [req.params.email],
    (err, rows) => {
      if (!err) {
        res.redirect('/viewStudents');
      } else {
        console.log(err);
      }
    }
  );
};
