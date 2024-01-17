const AppointmentFactory = require("../../factories/Appointment.factory");
const Appointment = require("../models/Appointment.model");

class AppointmentService {

    async Create(data) {

      await Appointment.create({ 
        ...data,
        finished: false 
     })
    }

    async GetAll(showFinished) {

        if(showFinished) {
            return await Appointment.find();
        }
        
        let appos = await Appointment.find({ 'finished': false })
        let appointments = [];

        appos.forEach(appointment => {
            if(appointment.date != null) {
                appointments.push( AppointmentFactory.Build(appointment) )
            }
        });

        return appointments;
    }
}

module.exports = new AppointmentService;