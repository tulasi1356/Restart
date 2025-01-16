const express = require('express');
const router = express.Router();
const {  getLogs} = require('../controllers/logController');

router.get('/', async (req, res) => {
    try {
        console.log('Received request43453543', req.body);
        const logs = await getLogs();
        console.log('Result:', logs);
        return res.status(200).json(logs);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


module.exports = router;