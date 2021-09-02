const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

router.post('/register', authController.register);
router.post('/registerAdmin', authController.registerAdmin);
router.post('/loginStudent', authController.loginStudent);
router.post('/loginAdmin', authController.loginAdmin);
router.get('/editStudent/:email', authController.editStudent);
router.post('/updateStudent', authController.updateStudent);
router.get('/deleteStudent/:email', authController.deleteStudent);
router.post('/deletedStudent', authController.deletedStudent);

module.exports = router;
