require('dotenv/config');
const connectDataBase = require('./src/db/index')
const express = require('express');
const app = express()

connectDataBase()
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.send('Rota padrão funcionando');
});

app.get('/cadastro', (req, res) => {
    res.render('create')
})

app.listen(8080, () => {
    console.log('Server Rodando na porta 8080')
});