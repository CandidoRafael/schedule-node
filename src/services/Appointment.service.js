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

    async GetById(id) {
        try {
            let event = await Appointment.findOne({'_id': id})
            return event
        } catch (error) {
            console.log(error)
        }
    }

    async Finish(id) {
        try {
          await Appointment.findByIdAndUpdate(id, { 'finished': true })
        } catch (error) {
          console.log(error)  
        }
    }
    // Query => Email
    // Query => CPF

    async Search(query) {
        let appo = await Appointment.find().or([{ 'email': query }, { 'cpf': query }])
        return appo;
    }
}

module.exports = new AppointmentService;