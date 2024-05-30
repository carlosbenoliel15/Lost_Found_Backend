const express = require('express');
const router = express.Router();
const {
  createPoliceStation,
  getPoliceStation,
  updatePoliceStation,
  getPoliceStationById,
  deletePoliceStation,
  createPoliceOfficer,
  updatePoliceOfficer,
  getPoliceOfficerById,
  deletePoliceOfficer,
  getPoliceOfficerByUserId
} = require('../controllers/policeController');

router.post('/police-stations', createPoliceStation);
router.get('/police-stations', getPoliceStation);
router.put('/police-stations/:id', updatePoliceStation);
router.get('/police-stations/:id', getPoliceStationById);
router.delete('/police-stations/:id', deletePoliceStation);

router.post('/police-officers', createPoliceOfficer);
router.put('/police-officers/:id', updatePoliceOfficer);
router.get('/police-officers/:id', getPoliceOfficerById);
router.delete('/police-officers/:id', deletePoliceOfficer);
router.get('/police-officers/users/:id', getPoliceOfficerByUserId);

module.exports = router;
