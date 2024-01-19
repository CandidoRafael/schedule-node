require('dotenv/config');
const express = require('express');
const connectDataBase = require('./src/db/index')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http);
const AppointmentService = require('./src/services/Appointment.service');


connectDataBase()
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

io.on("connection", (socket) => {

   socket.on('cadastro', (data) => {
        socket.emit('calendar', data)
   })
})

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

app.get('/event/:id', async (req, res) => {
    let appointment = await AppointmentService.GetById(req.params.id)
    res.render('event', { appo: appointment });
})

app.post('/finish', async (req, res) => {
    let id = req.body.id;
    await AppointmentService.Finish(id);
    res.redirect('/');
})

app.get('/list', async (req, res) => {
    
    let appos = await AppointmentService.GetAll(true);
    res.render('list', { appos })
})

app.get('/searchresult', async (req, res) => {
    try {
        let appos = await AppointmentService.Search(req.query.search);
        res.render('list', { appos })
    } catch (error) {
        console.log(error);
        res.status(500).send('Algo deu errado')
    }
})

let pollTime = 1000 * 60 * 5;

setInterval(async() => {

 await AppointmentService.SendNotification();
 
}, pollTime)



http.listen(8080, () => {
    console.log('Server Rodando na porta 8080')
});