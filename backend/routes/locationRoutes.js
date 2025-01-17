const express = require('express');
const router = express.Router();
const { createLocation, getLocations, updateLocation,updateStatusInLocation, getLocationHistory, deleteLocationHistory, deleteLocation } = require('../controllers/locationController');

router.post('/', createLocation);
router.get('/get', getLocations);
router.get('/:id/history', getLocationHistory);
router.delete("/history/:id", deleteLocationHistory);
router.put('/:id', updateLocation);
router.delete('/:id', deleteLocation);
router.put('/status/:id', updateStatusInLocation);


module.exports = router;