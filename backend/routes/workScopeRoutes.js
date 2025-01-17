const express = require('express');
const router = express.Router();
const {  getWorkScopes, createWorkScope, mapLocationToScope} = require('../controllers/workScopeController');

router.get('/', getWorkScopes);
router.post('/', createWorkScope)
router.post("/map", mapLocationToScope);

module.exports = router;