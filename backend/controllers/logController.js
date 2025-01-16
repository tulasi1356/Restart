
const Log = require('../models/log');
const workScope = require('../models/workScope');


exports.getLogs = async (req, res) => {
    try {
      
      const logs = await Log.find();

    console.log('123logs', logs);
      
      const filteredLogs = logs.filter(async log => {

        console.log('log*****', log);
        if (log.isCompleted) return false;
        
        const scope = await workScope.findById(log.workscope);
        console.log('scope&&&&&&&&&&', scope);
        if (!scope) return false;
        
        const currentTime = new Date();
        console.log('currentTime', currentTime);
        const duration = scope.duration;
        const startTime = scope.displayTime;
        const endtimeInHours = scope.variance;
        const createdAt = scope.createdAt;
        console.log('createdAt', createdAt);
        const diff = Math.abs(currentTime - createdAt);
        console.log('diff', diff);
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        console.log('days', days);
        if (days > duration) {
            console.log('days > duration', days, duration);
          log.isCompleted = true;
          log.save();
          return false;
        } else {
            const [startHours, startMinutes] = startTime.split(':').map(Number);
            const startDateTime = new Date(createdAt);
            startDateTime.setHours(startHours, startMinutes, 0, 0);

            const endDateTime = new Date(startDateTime);
            endDateTime.setHours(startDateTime.getHours() + endtimeInHours);

            console.log('startDateTime', startDateTime);
            console.log('endDateTime', endDateTime);
            console.log('currentTime', currentTime);
            if (currentTime >= startDateTime && currentTime <= endDateTime) {
                return true;
            } else {
                return false;
            }
        }

      });
    console.log('filteredLogs', filteredLogs);
      return filteredLogs;
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };