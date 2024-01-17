const Appointment = require("../models/Appointment.model");

class AppointmentService {

    async Create(data) {

      await Appointment.create({ 
        ...data,
        finished: false 
     })
    }
}

module.exports = new AppointmentService;