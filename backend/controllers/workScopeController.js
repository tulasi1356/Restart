
const Location = require('../models/location');
const WorkScope = require('../models/workScope');
const createHistoryLog = require('./locationController').createHistoryLog;

exports.createWorkScope = async (req, res) => {
    try {
      const workScope = new WorkScope(req.body);
      const savedWorkScope = await workScope.save();
      console.log("Insertion successful", savedWorkScope);
      return res.status(200).json(savedWorkScope);
    } catch (error) {
      console.error('Error creating work scope:', error);
      return res.status(500).json({ message: error.message });
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
      const oldLocation = location.toObject();
      location.workScope = scopeId;
      await location.save();

      await createHistoryLog(
        location._id,
        'UPDATE',
        oldLocation,
        location.toObject()
      );
      res.status(200).json(location);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };


exports.getWorkScopes = async (req, res) => {
    try {
      const workScopes = await WorkScope.find();
      return res.status(200).json(workScopes ?? []);
    } catch (error) {
        console.error('Error getting work scopes:', error);
        return res.status(500).json({ message: error.message });
        
    }
  }
  