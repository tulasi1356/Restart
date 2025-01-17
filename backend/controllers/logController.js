const Log = require("../models/log");
const workScope = require("../models/workScope");

exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find();
    const filteredLogs = await Promise.all(
      logs.map(async (log) => {
        if (log.isCompleted) return false;

        const scope = await workScope.findById(log.workscope);

        if (!scope) return false;

        const currentTime = new Date();

        const duration = scope.duration;
        const startTime = scope.displayTime;
        const endtimeInHours = scope.variance;
        const createdAt = scope.createdAt;

        const diff = Math.abs(currentTime - createdAt);

        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

        if (days > duration) {
          console.log("days > duration", days, duration);
          log.isCompleted = true;
          log.save();
          return false;
        } else {
          const [startHours, startMinutes] = startTime.split(":").map(Number);

          const startDateTime = new Date(createdAt);

          startDateTime.setHours(startHours, startMinutes, 0, 0);

          const endDateTime = new Date(startDateTime);
          endDateTime.setHours(startDateTime.getHours() + endtimeInHours);

          if (currentTime >= startDateTime && currentTime <= endDateTime) {
            return log;
          } else {
            return false;
          }
        }
      })
    ).then((results) => results.filter((result) => result !== false));
    console.log("filteredLogs", filteredLogs);
    return res.status(200).json(filteredLogs);
  } catch (error) {
    console.error("Error in getLogs", error);
    return res.status(500).json({ message: error.message });
  }
};
