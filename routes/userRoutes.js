const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const ownerController = require('../controllers/ownerController');

// Rota para criar um novo usuário
router.post('/signup', userController.createUser);

router.put('/update/:id', userController.updateUserById);  

router.delete('/delete/:id', userController.deleteUserById);

router.get('/profile/:id',userController.getUserInfo);

//router.get('/findByEmail/:email', userController.

//Routes for owner
router.get('/owner/foundobjects/', ownerController.getListFoundObject);
router.get('/owner/lostobjects/:id', ownerController.getListLostObject);
router.get('/owners/:id', ownerController.getOwnerInfo);
router.post('/owner/:id', ownerController.createOwner);

module.exports = router;