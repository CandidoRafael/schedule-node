const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    name: String,
    email: String,
    cpf: String,
    description: String,
    date: Date,
    time: String,
    finished: Boolean,
    notified: Boolean
});

const Appointment = mongoose.model('Appointment', AppointmentSchema)

module.exports = Appointment;