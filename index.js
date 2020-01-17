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
    const {firstName, lastName, organization, email, phoneNumber, username, password} = req.body;
    console.log(req.body);
    console.log(req.query.msg);

    try {
        const userID = await user.createUser(firstName, lastName, organization, email, phoneNumber, username, password);
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
    const { username, password } = req.body;
    console.log(req.body);

    try { // try: checks if username has match in db
        const {isUserValid, theUser} = await user.userLogin(username, password);
        console.log(isUserValid);
        console.log(isUserValid);


        // if/else checks if password has match in db
        if (isUserValid)  {
            // add info to user session
            console.log("before req.session.user")
            req.session.user= { // the user object is being created 
                username: theUser.user_name,
                id: theUser.user_id,
                name: theUser.first_name
            };
            console.log("hits req session")
            req.session.save(() => {
                console.log('The session is now saved!!!');
                // This avoids a long-standing
                // bug in the session middleware
                res.redirect('/profile');
            });

        } else {
            res.redirect('/login?msg=loginInvalid') 
        };

    } catch (err) {
        res.redirect('/login?msg=loginInvalid')
        console.log(err)
    };
});



// PROFILE
app.get('/profile', (req, res) => {
    res.render('profile');
    // res.send(`Welcome back ${req.session.user.name}`) if you want to send user session info to page
});








//LOGOUT 







server.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});