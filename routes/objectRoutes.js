const express = require('express');
const router = express.Router();
const objectController = require('../controllers/objectController');

const multer = require("multer");

const upload = multer({ dest: 'uploads/' })

//---------------------------- Test  Route -----------------------------------
router.get('/test', objectController.test);

//---------------------------- Lost Objects  Route -----------------------------------

router.post('/lost-objects', upload.array('objectImage[]', 10),  objectController.createLostObject);
router.get('/lost-objects', objectController.getAllLostObjects);
router.get('/lost-objects/:lostObjectId', objectController.getLostObjectById);
router.put('/lost-objects/:lostObjectId', objectController.updateLostObject);
router.delete('/lost-objects/:lostObjectId', objectController.deleteLostObject);
router.post('/match/',objectController.getLostMatch);
router.get('/lost-objects/user/:id', objectController.getLostObjectByUserId);
router.get('lost-objects/description/:description', objectController.getLostObjectByDescription);

router.post('/found-objects', upload.array('objectImage[]', 10), objectController.createFoundObject);
router.post('/found-objects_registeredUser', objectController.createFoundObject);
router.get('/found-objects', objectController.getAllFoundObjects);
router.get('/found-objects/:foundObjectId', objectController.getFoundObjectById);
router.put('/found-objects/:foundObjectId', objectController.updateFoundObject);
router.delete('/found-objects/:foundObjectId', objectController.deleteFoundObject);

module.exports = router;
