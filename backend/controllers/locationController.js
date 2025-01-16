const Location = require('../models/location');
const Log = require('../models/log');
// const WorkScope = require('../models/workScope');

exports.createLocation = async (req, res) => {
    console.log('createLocation', req.body);
    try {
      const location = new Location({
        name: req.body.name
      });
      const savedLocation = await location.save();
      console.log('savedLocation', savedLocation);
      return res.status(200).json({ message: 'Insertion successful', location: savedLocation });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };
  
  exports.getLocations = async (req, res) => {
    try {
    const locations = await Location.find();
    res.json(locations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  exports.updateLocation = async (req, res) => {
    try {
      const location = await Location.findById(req.params.id);
      if (!location) return res.status(404).json({ message: 'Location not found' });
      
      Object.assign(location, req.body);
      console.log('location', location);
      const updatedLocation = await location.save();
      res.json(updatedLocation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  exports.updateStatusInLocation = async (req, res) => {
    try {
    console.log('updateStatusInLocation', req.params.id);
    const location = await Location.findById(req.params.id);
    console.log('location', location);
    if (!location) return res.status(404).json({ error: 'Location not found' });
    
    // Mark location as complete
    location.isComplete = true;
    await location.save();

    // Loop to create logs for the next 'duration' days
      const log = new Log({
        location: location._id,
        workscope: location.workScope,
        isCompleted: false,
        createdAt: new Date(),
        });

      await log.save();  // Save the log

    return res.json({ message: 'Location marked as complete and logs created' });
  } catch (err) {
    return res.status(500).json({ error: 'Error marking location complete and creating logs' });
  }
}

  exports.deleteLocation = async (req, res) => {
    try {
    console.log('deleteLocation', req.params.id);
      const logs = await Log.find({ location: req.params.id });
      console.log('logsfsdfdsfdsf', logs);
      if (logs.length > 0) {
        return res.status(400).json({ message: 'Cannot delete location with associated logs' });
      }
      console.log('deleteLocation', req.params.id);
      await Location.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Location deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }

   
  };
