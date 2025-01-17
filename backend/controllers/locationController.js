const Location = require('../models/location');
const Log = require('../models/log');
const LocationHistory = require('../models/locationHistory');


exports.createHistoryLog = async (locationId, action, oldValue, newValue) => {
    try {
      await LocationHistory.create({
        locationId,
        action,
        oldValue,
        newValue,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error creating history log:', error);
    }
  };
  
  const createHistoryLog = exports.createHistoryLog;
exports.createLocation = async (req, res) => {
    console.log('createLocation', req.body);
    try {
      const location = new Location({
        name: req.body.name
      });
      const savedLocation = await location.save();
      console.log('savedLocation', savedLocation);
      await createHistoryLog(
        savedLocation._id,
        'CREATE',
        null,
        savedLocation.toObject()
      );
      return res.status(200).json({ message: 'Insertion successful', location: savedLocation });
    } catch (error) {
      console.error('Error creating location:', error);
      return res.status(500).json({ message: error.message });
    }
  };
  
  exports.getLocations = async (req, res) => {
    try {
      const locations = await Location.find({ deletedAt: null });
      res.status(200).json(locations);
    } catch (error) {
      console.error('Error getting locations:', error);
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.updateLocation = async (req, res) => {
    try {
      const location = await Location.findById(req.params.id);
      if (!location) return res.status(404).json({ message: 'Location not found' });
      
      const oldLocation = location.toObject();
      Object.assign(location, req.body);
      console.log('location', location);
      const updatedLocation = await location.save();
      await createHistoryLog(
        updatedLocation._id,
        'UPDATE',
        oldLocation,
        updatedLocation.toObject()
      );
      res.status(200).json(updatedLocation);
    } catch (error) {
      console.error('Error updating location:', error);
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.updateStatusInLocation = async (req, res) => {
    try {
      const location = await Location.findById(req.params.id);
      if (!location) return res.status(404).json({ error: 'Location not found' });
      if (!location.workScope)  return res.status(500).json({ error: 'Location does not have a work scope' });
      const oldLocation = location.toObject();
      location.isComplete = true;
      
      await location.save();
      await createHistoryLog(
          location._id,
          'COMPLETE',
          oldLocation,
          location.toObject()
        );

      const log = new Log({
          location: location._id,
          workscope: location.workScope,
          isCompleted: false,
          createdAt: new Date(),
          });

      await log.save(); 
      console.log('Location marked as complete and logs created');
      return res.status(200).json({ message: 'Location marked as complete and logs created' });
  } catch (err) {
    console.error('Error marking location complete and creating logs:', err);
    return res.status(500).json({ error: 'Error marking location complete and creating logs' });
  }
}

  exports.deleteLocation = async (req, res) => {
    try {
   
      const logs = await Log.find({ location: req.params.id });
      if (logs.length > 0) {
        return res.status(400).json({ message: 'Cannot delete location with associated logs' });
      }
      
      const location = await Location.findById(req.params.id);
      if (!location) return res.status(404).json({ message: 'Location not found' });

      location.deletedAt = new Date();

      await location.save();
      
      await createHistoryLog(
          location._id,
          'DELETE',
          location.toObject(),
          null
        );
        console.log('Location deleted successfully');
        return res.status(200).json({ message: 'Location deleted successfully' });
    } catch (error) {
      console.error('Error deleting location:', error);
      return res.status(500).json({ message: error.message });
    }
  };

  exports.getLocationHistory = async (req, res) => {
    try {
      const history = await LocationHistory.find({ locationId: req.params.id })
        .sort({ timestamp: -1 });
        console.log('history', history);
      res.json(history);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  exports.deleteLocationHistory = async (req, res) => {
    try {
        console.log('deleteLocationHistory', req.params.id);
      const history = await LocationHistory.findByIdAndDelete(req.params.id);
      if (!history) return res.status(404).json({ message: 'History not found' });
      res.json({ message: 'History deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
