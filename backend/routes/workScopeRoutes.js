const express = require('express');
const router = express.Router();
const {  getWorkScopes, createWorkScope, mapLocationToScope} = require('../controllers/workScopeController');

router.get('/', async (req, res) => {
     try{
        const workScopes = await getWorkScopes();
        console.log('workScopes', workScopes);
        return res.status(200).json(workScopes);
     } catch (error) {
        return res.status(500).json({ message: error.message });
     }
    });

router.post('/', async (req, res) => {
    try {
      const result = await createWorkScope(req, res);
    return result;
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})

router.post("/map", async (req, res) => {
    try {
      const result = await mapLocationToScope(req, res);
      return result;
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
module.exports = router;