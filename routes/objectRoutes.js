const express = require('express');
const router = express.Router();
const objectController = require('../controllers/objectController');

//---------------------------- Los Objects  Route -----------------------------------

router.post('/lost-objects', objectController.createLostObject);
router.get('/lost-objects', objectController.getAllLostObjects);
router.get('/lost-objects/:lostObjectId', objectController.getLostObjectById);
router.put('/lost-objects/:lostObjectId', objectController.updateLostObject);
router.delete('/lost-objects/:lostObjectId', objectController.deleteLostObject);

//---------------------------- FoundObjects Routes ------------------------------------

router.post('/found-objects', objectController.createFoundObject);
router.get('/found-objects', objectController.getAllFoundObjects);
router.get('/found-objects/:foundObjectId', objectController.getFoundObjectById);
router.put('/found-objects/:foundObjectId', objectController.updateFoundObject);
router.delete('/found-objects/:foundObjectId', objectController.deleteFoundObject);

module.exports = router;