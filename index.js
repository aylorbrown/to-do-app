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

const user = require('./models/user')

const PORT = 3000;

//home 
app.get('/', (req, res) => {
    console.log('You are home!');
    res.render('home');
});


//create User
app.get('/create', (req, res) => { 
    let errorMsg = ''
    if (req.query.msg === 'usernameTaken') {
        errorMsg = 'This username is already taken.'
    }
    res.render('createUser', {
        locals: {
            errorMsg
        }
    });

})

app.post('/create', parseForm, async (req, res) => {
    const {firstName, lastName, organization, email, phoneNumber, userName, password} = req.body;
    console.log(req.body);
    console.log(req.query.msg);

    try {
        const userID = await user.createUser(firstName, lastName, organization, email, phoneNumber, userName, password);
        res.redirect('/login')
       
    } catch (err) {
        res.redirect('/create?msg=usernameTaken')
    }

})


//login 
app.get('/login', (req, res) => {
    res.render('login');
});


app.post('/login', parseForm, async (req, res) => {
    const { userName, password } = req.body;
    console.log(req.body);

    // try checks for username to match in db
    try {
        const isUserValid = await user.userLogin(userName, password);

        // if/else check for password to match in db
        if (isUserValid) {
            res.redirect('/profile')
        }else{
            res.redirect('/login') 
        };
        
    } catch (err) {
        res.redirect('/login')
    }

});


// profile
app.get('/profile', (req, res) => {
    res.render('profile');
});








//logout 







server.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});