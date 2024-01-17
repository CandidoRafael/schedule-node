require('dotenv/config');
const connectDataBase = require('./src/db/index')
const express = require('express');
const AppointmentService = require('./src/services/Appointment.service');
const app = express()

connectDataBase()
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index')
});

app.get('/cadastro', (req, res) => {
    res.render('create')
})

app.post('/create', async (req, res) => {
    const data = req.body;

    try {
        await AppointmentService.Create(data);
        res.status(200).send('Paciente cadastrado!')
    } catch (error) {
        res.status(500).send(error)        
    }

})

app.get('/getcalendar', async (req ,res) => {

    let consultas = await AppointmentService.GetAll(false)

    res.json(consultas)
})

app.listen(8080, () => {
    console.log('Server Rodando na porta 8080')
});