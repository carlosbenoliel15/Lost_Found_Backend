const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rota para criar um novo usuário
router.post('/signup', userController.createUser);

router.put('/update/:id', userController.updateUserById);  

router.delete('/delete/:id', userController.deleteUserById);

router.get('/profile/:id',userController.getUserInfo);


//router.get('/findByEmail/:email', userController.
module.exports = router;
