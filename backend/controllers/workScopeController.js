
const Location = require('../models/location');
const WorkScope = require('../models/workScope');

exports.createWorkScope = async (req, res) => {
    try {
      const workScope = new WorkScope(req.body);
      const savedWorkScope = await workScope.save();
      res.status(200).json({message:  "Insertion successful", workScope: savedWorkScope});
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  exports.mapLocationToScope = async (req, res) => {
    try {
      const { locationId, scopeId } = req.body;
      
      // Check if location is already mapped to another scope
      const location = await Location.findById(locationId);
      if (location.workScope) {
        return res.status(400).json({ message: 'Location already mapped to a scope' });
      }
      
      location.workScope = scopeId;
      await location.save();
      res.json(location);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };


exports.getWorkScopes = async (req, res) => {
    try {
    const workScopes = await WorkScope.find();
    if (workScopes.length === 0) {
       return []
    }
    return workScopes;
    } catch (error) {
        console.log('error', error);
     throw new Error(error.message);
    }
  }
  