const express = require('express');
const router = express.Router();
const {
  createPoliceStation,
  updatePoliceStation,
  getPoliceStationById,
  deletePoliceStation,
  createPoliceOfficer,
  updatePoliceOfficer,
  getPoliceOfficerById,
  deletePoliceOfficer,
  createFoundObjectByPolice,
  updateFoundObjectByPolice,
  getFoundObjectByIdByPolice,
  deleteFoundObjectByPolice
} = require('../controllers/policeController');


router.post('/police-stations', createPoliceStation);
router.put('/police-stations/:id', updatePoliceStation);
router.get('/police-stations/:id', getPoliceStationById);
router.delete('/police-stations/:id', deletePoliceStation);

router.post('/police-officers', createPoliceOfficer);
router.put('/police-officers/:id', updatePoliceOfficer);
router.get('/police-officers/:id', getPoliceOfficerById);
router.delete('/police-officers/:id', deletePoliceOfficer);

router.post('/found-objects-by-police/', createFoundObjectByPolice);
router.put('/found-objects-by-police/:id', updateFoundObjectByPolice);
router.get('/found-objects-by-police/:id', getFoundObjectByIdByPolice);
router.delete('/found-objects-by-police/:id', deleteFoundObjectByPolice);

module.exports = router;
