const express = require('express');
const router = express.Router();
const { createLocation, getLocations, updateLocation,updateStatusInLocation, deleteLocation } = require('../controllers/locationController');

// Add error handling
router.post('/', async (req, res, next) => {
  try {
    console.log('Received request:', req.body);
    const result = await createLocation(req, res);
    console.log('Result:', result);
    return result;
  } catch (error) {
    console.error('Error in location route:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/get', async (req, res, next) => {
  try {
    console.log('Received request:', req.body);
    const result = await getLocations(req, res);
    console.log('Result:', result);
    return result;
  } catch (error) {
    console.error('Error in location route:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.put('/:id', async (req, res, next) => {
    try {
        console.log('Received request:', req.body);
        const result = await updateLocation(req, res);
        console.log('Result:', result);
        return result;
    } catch (error) {
        console.error('Error in location route:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        console.log('Received request:', req.body);
        const result = await deleteLocation(req, res);
        console.log('Result:', result);
        return result;
    } catch (error) {
        console.error('Error in location route:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.put('/status/:id', async (req, res, next) => {
    try {
        console.log('Received request:', req.body);
        const result = await updateStatusInLocation(req, res);
        console.log('Result:', result);
        return result;
    } catch (error) {
        console.error('Error in location route:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = router;