const AppointmentFactory = require("../../factories/Appointment.factory");
const Appointment = require("../models/Appointment.model");

class AppointmentService {

    async Create(data) {
        try {
            await Appointment.create({ 
              ...data,
              finished: false,
              notified: false
           })
        } catch (error) {
            console.log(error)
        }
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
 
    async Search(query) {
        let appo = await Appointment.find().or([{ 'email': query }, { 'cpf': query }])
        return appo;
    }

    async SendNotification() {
       let appos = await this.GetAll(false);
       console.log(appos)
    }
}

module.exports = new AppointmentService;