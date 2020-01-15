const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);

const db = require('./models/connection');

const es6Renderer = require('express-es6-template-engine');
app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');

const bodyParser = require('body-parser');
const parseForm = bodyParser.urlencoded({
    extended: true
});

const PORT = 3000;

//home 
app.get('/', (req, res) => {
    console.log('You are home!');
    res.render('home');
});

//login 
app.get('/login', (req, res) => {
    res.render('form');
});

app.post('/login', parseForm, (req, res) => {
    const { firstName, lastName, password } = req.body;
    console.log(req.body);
});

//logout 







server.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});