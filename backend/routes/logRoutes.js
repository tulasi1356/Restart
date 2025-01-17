const express = require('express');
const router = express.Router();
const {  getLogs, completeLog} = require('../controllers/logController');

router.get('/', getLogs);
router.put("/:id/complete", completeLog);

module.exports = router;