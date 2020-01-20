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


//************TRAVIS*******//
//pulls in functions from events.js//
const events = require('./models/events');







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
    let errorMsg = ''
    if (req.query.msg === 'userLogout') {
        errorMsg = 'You have been signed out!'
    }
    res.render('home', {
        locals: {
            errorMsg
        }
    });
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
    res.render('profile', {
        locals: {
            name: req.session.user.name
        }
    // res.send(`Welcome back ${req.session.user.name}`) if you want to send user session info to page
    })
});


//****TRAVIS******/
//below is for listing all events from your  profile page

app.get('/profile/listevents', async (req, res) =>{
    const allEvents = await events.listEvents();
    console.log(allEvents);
    res.send(allEvents);
});

app.get('/profile/createevent', async (req, res) => {
    res.render('createEvent');
})

app.post('/profile/createevent', parseForm, async (req, res) => {
    const {eventName, eventLocation, eventDate, eventTime, eventDescription} = req.body;
    try{
     console.log(req.body);
     const newEvent = await events.createEvent(eventName, eventLocation, eventDate, eventTime, eventDescription);
    //  newEvent.command === "INSERT" && newEvent.rowCount >= 1;   
    //  console.log(newEvent.command);
    
    }

    catch (err){
        console.log(err);
    }
    
})

// SAVE TASKS TO USER PROFILE

app.post('/profile/createevent', parseForm, async (req, res) => {
    const {eventName, eventLocation, eventDate, eventTime, eventDescription} = req.body;
    try{
     console.log(req.body);
     const newEvent = await events.createEvent(eventName, eventLocation, eventDate, eventTime, eventDescription);
    //  newEvent.command === "INSERT" && newEvent.rowCount >= 1;   
    //  console.log(newEvent.command);
    
    }

    catch (err){
        console.log(err);
    }
    
})










//LOGOUT 
app.get('/logout', (req, res) => {
    // Get rid of the user's session!
    // Then redirect them to the home page.
    req.session.destroy(() => {
        console.log('The session is now destroyed!!!');
        // This avoids a long-standing
        // bug in the session middleware
        res.redirect('/?msg=userLogout');
    });
    
})






server.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});