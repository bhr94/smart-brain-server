// import express from 'express';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var cors = require('cors')
// import bodyParser from 'body-parser';
var knex = require("knex");
// var bcrypt = require("bcrypt");
// const saltRounds = 10;
// const register = require("./controllers/register");
// const signin = require("./controllers/signin");
const imageurl = require("./controllers/image")
const { firebase, admin } = require("./fbConfig")
var cookieParser = require('cookie-parser')
// var firebaseMiddleware = require('express-firebase-middleware');
var csrf = require('csurf')

// app.use(csrf({ cookie: true }))
app.use(cookieParser())




app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


var db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'bahar',
        password: '',
        database: 'smart-brain'
    }
});
//app.use(express.static(__dirname + '/public')); // for sending html css or js files to the browser


app.get('/', (req, res) => {
    res.send(database.users)
});




// app.post('/signin', (req, res)  => signin.handleSignin(req, res, db, bcrypt));

// app.post('/register', (req, res) => register.handleRegister(req,res,db, bcrypt, saltRounds));

app.post("/signin", (req, res) => {
    firebase.auth().signInWithEmailAndPassword(/*userInfo.email, userInfo.password*/req.body.email, req.body.password)
        .then(function () {
            firebase.auth().currentUser.getIdToken(true).then(function (idToken) {
                const expiresIn = 60 * 60 * 24 * 5 * 1000;
                admin.auth().createSessionCookie(idToken, { expiresIn })
                    .then((sessionCookie) => {
                        // Set cookie policy for session cookie.
                        const options = { maxAge: expiresIn, httpOnly: true, secure: true };
                        res.cookie('session', sessionCookie, options);
                        res.setHeader("Set-Cookie", "session=" + sessionCookie + "; HttpOnly");
                        // res.send(idToken)
                        db.select('*').from('users')
                            .where('email', '=', req.body.email)
                            .then(user => {
                                res.json(user[0]);
                            })
                            .catch(function (error) {
                                console.log(error)
                            });
                    })
                    .catch(error => {
                        res.status(400).json(error)
                    })


            })
                .catch(function (error) {
                    res.status(400).json("unsuccesful registration. error: " + error)
                });
        })
        .catch(error => res.status(400).json(error))
})



app.post("/register", (req, res) => {
    firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password)
        .then(function () {
            firebase.auth().currentUser.getIdToken(true).then(function (idToken) {
                const expiresIn = 60 * 60 * 24 * 5 * 1000;
                admin.auth().createSessionCookie(idToken, { expiresIn })
                    .then(async (sessionCookie) => {
                        const options = { maxAge: expiresIn, httpOnly: true, secure: true };
                        res.cookie('session', sessionCookie, options);
                        res.setHeader("Set-Cookie", "session=" + sessionCookie + "; HttpOnly", SameSite=Strict);
                        // res.send(idToken)
                        user = db("users")
                            .returning("*")
                            .insert({
                                email: req.body.email,
                                name: req.body.name,
                                joined: new Date()
                            })
                        // .then(res => res.json(user[0]))
                        res.json(user[0])
                    })
                    .catch(error => {
                        res.status(401).send(error);
                    })

            })
                .catch(error => {
                    res.status(401).send(error);
                })
            // res.end(JSON.stringify({ status: 'success' }));
        })
        .catch(function (error) {
            // res.redirect('/signin');
            res.status(400).json(error)


        });

})



app.use(
    (req, res, next) => {
        let sessionCookie = req.cookies.session
        admin.auth().verifySessionCookie(
            sessionCookie, true /** checkRevoked */)
            .then((decodedClaims) => {
                next()
            })
            .catch(error => {
                res.redirect('/login');
            });
    }
);


app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select("*").from("users").where({ id })
        .then(user => {
            if (user.length) {
                res.json(user[0])
            }
            else {
                res.status(400).json("Not found")
            }
        })
        //  } else{
        //      res.status(404).json('no such user');
        //  }
        .catch(err => {
            res.status(400).json("error getting user")
        })
})
// app.put('/image', (req, res) =>{ - this is an endpoint and endpoints are for connecting the server and fetching data
// from the server. Creating an endpoint does not mean that it shoul represent a query(link)


// app.put('/image', (req, res) => {
//     const { id } = req.body;
//     db("users").where("id", "=", id)
//         .increment("entries", 1)
//         .returning("entries")
//         .then(entries => {
//             res.json(entries[0])
//         })
//         .catch(err => {
//             res.status(400).json(err + " unabel to get entries")
//         })


// })



app.put("/image", (req, res) => {
    const { id } = req.body;

    var user = firebase.auth().currentUser;
    if (user) {

        db("users").where("id", "=", id)
            .increment("entries", 1)
            .returning("entries")
            .then(entries => {
                res.json(entries[0])
            })
    }

    else {
        console.log("There is no current user.");
    }
})



app.post("/imageurl", (req, res) => {
    imageurl.handleApiCall(req, res)
})



app.post('/sessionLogout', (req, res) => {
    res.clearCookie('session');
    res.redirect('/login');
});

app.listen(3001);

// 1. signin route ---> POST ==  success/fail  
// 2. register route ---> POST = user
//profile/:userid --->  GET = user
/// image  ---> put -- user



