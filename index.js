const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const PORT = 3000;

const db = require('./models/connection');
const user = require('./models/user')

const es6Renderer = require('express-es6-template-engine');
app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');

const bodyParser = require('body-parser');
const parseForm = bodyParser.urlencoded({
    extended: true
});

const session = require('express-session'); //session management middleware
const fileStore = require('session-file-store')(session); // modified version of middleware management and helps save session to file of hard drive



// SESSION MANAGEMENT
app.use(session({
    store: new fileStore({}),
    secret: '76260r57650fd743046561076' // must move into secure location
}));

app.use((req, res, next) =>  {
    console.log('***********');
    console.log(req.session);
    console.log('***********');

    next();
});



// HOME 
app.get('/', (req, res) => {
    console.log('You are home!');
    res.render('home');
});



// SIGNUP
app.get('/signup', (req, res) => { 
    let errorMsg = ''
    if (req.query.msg === 'usernameTaken') {
        errorMsg = 'This username is already taken.'
    }
    res.render('signup', {
        locals: {
            errorMsg
        }
    });
});

app.post('/signup', parseForm, async (req, res) => {
    const {firstName, lastName, organization, email, phoneNumber, userName, password} = req.body;
    console.log(req.body);
    console.log(req.query.msg);

    try {
        const userID = await user.createUser(firstName, lastName, organization, email, phoneNumber, userName, password);
        res.redirect('/login')
       
    } catch (err) {
        res.redirect('/signup?msg=usernameTaken')
    };
});



// LOGIN
app.get('/login', (req, res) => {
    let errorMsg = ''
    if (req.query.msg === 'loginInvalid') {
        errorMsg = 'Username or password is invalid.'
    }
    res.render('login', {
        locals: {
            errorMsg
        }
    });

});

app.post('/login', parseForm, async (req, res) => {
    const { userName, password } = req.body;
    console.log(req.body);

    try { // try: checks if username has match in db
        const isUserValid = await user.userLogin(userName, password);

        // if/else checks if password has match in db
        if (isUserValid) {
            res.redirect('/profile')
        } else {
            res.redirect('/login') 
        };

    } catch (err) {
        res.redirect('/login?msg=loginInvalid')
    };
});



// PROFILE
app.get('/profile', (req, res) => {
    res.render('profile');
});








//LOGOUT 







server.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});