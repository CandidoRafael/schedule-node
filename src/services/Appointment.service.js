const AppointmentFactory = require("../../factories/Appointment.factory");
const Appointment = require("../models/Appointment.model");
const nodemailer = require('nodemailer');
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

       let transporter = nodemailer.createTransport({
        host: process.env.HOST_NODEMAILER,
        port: process.env.PORT_NODEMAILER,
        auth: {
            user: process.env.USER_NODEMAILER,
            pass: process.env.PASS_NODEMAILER
        }
    });
    
       appos.forEach(async appo => {
            let date = appo.start.getTime(); //miliseconds
            let hour = 1000 * 60 * 60; // Hour in miliseconds
            let gap = date - Date.now();

            if(gap <= hour) {

                if(!appo.notified) {

                    await Appointment.findByIdAndUpdate(appo.id, { 'notified': true });

                   transporter.sendMail({
                        from: "Clinica Bem+ <clinica@rcode.com.br>",
                        to: appo.email,
                        subject: 'Consulta agendada na Bem+',
                        text: 'Passando para avisar que sua consulta está marcada para daqui 1 hora. '
                   }).then(() => {})
                     .catch(err => console.log(err))
                }
            }
       })
    }
}

module.exports = new AppointmentService;