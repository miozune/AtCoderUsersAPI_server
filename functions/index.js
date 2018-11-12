const firebase = require("firebase");
const functions = require('firebase-functions');
const express = require("express");
require('dotenv').config();

const LOGIN_EMAIL = process.env.LOGIN_EMAIL;
const LOGIN_PASSWORD = process.env.LOGIN_PASSWORD;

const config = {
    apiKey: "AIzaSyDWUIc_yvi_lTszXsTMkWPPznAh4nBu0eA",
    authDomain: "atcoderusersapi.firebaseapp.com",
    databaseURL: "https://atcoderusersapi.firebaseio.com",
    projectId: "atcoderusersapi",
    storageBucket: "atcoderusersapi.appspot.com",
    messagingSenderId: "496836862428"
};
firebase.initializeApp(config);
const auth = firebase.auth();
const db = firebase.database();
auth.signInWithEmailAndPassword(LOGIN_EMAIL, LOGIN_PASSWORD);


const app = express();

const errorMessage400 =
`Using invalid URL.

Usage: /api/info/[query]/[name]
Query:
    - username: search by username
    - twitterID: search by twitterID
Name: the name you want
Example: "/api/info/username/tourist"`;

const errorMessage500 =
`Error occured in server. Please report to admin.
Twitter: @miozune, GitHub: https://github.com/miozune/AtCoderUsersAPI_server`;

app.get('/info/:query/:name', (req, res) => {
    const query = req.params.query;
    const name = req.params.name;

    switch (query) {
        // Googleさんasync/awaitに対応してくださいなのです
        case 'username': {
            db.ref(`by_username/${name}`).once('value', snapshot => {
                res.status(200).send({
                    "data": snapshot,
                });
            }, err => {
                console.log('ReAuth');
                const _ = err;  // Discard
                auth.signInWithEmailAndPassword(LOGIN_EMAIL, LOGIN_PASSWORD)
                    .then(() => {
                        db.ref(`by_username/${name}`).once('value', snapshot => {
                            res.status(200).send({
                                "data": snapshot,
                            });
                        }, err => {
                            console.error('Failed to get data.');
                            console.log(err);
                            res.status(500).send({
                                "error": {
                                    "status": 500,
                                    "title": "Internal Server Error",
                                    "detail": errorMessage500,
                                }
                            });
                        });
                        return;
                    })
                    .catch(err => {
                        console.error('Failed to sign in.');
                        console.log(err);
                        res.status(500).send({
                            "error": {
                                "status": 500,
                                "title": "Internal Server Error",
                                "detail": errorMessage500,
                            }
                        });
                    });
            });
            // auth.signInWithEmailAndPassword(LOGIN_EMAIL, LOGIN_PASSWORD)
            //     .then(() => {
            //         db.ref(`by_username/${name}`).once('value', snapshot => {
            //             res.status(200).send({
            //                 "data": snapshot,
            //             });
            //         }, err => {
            //             console.log(err);
            //             res.status(500).send({
            //                 "error": {
            //                     "status": 500,
            //                     "title": "Internal Server Error",
            //                     "detail": errorMessage500,
            //                 }
            //             });
            //         });
            //         return;
            //     })
            //     .catch(err => {
            //         console.log('Failed to sign in.');
            //         console.log(err);
            //         res.status(500).send({
            //             "error": {
            //                 "status": 500,
            //                 "title": "Internal Server Error",
            //                 "detail": errorMessage500,
            //             }
            //         });
            //     });
            // auth.currentUser.getIdToken(true)
            //     .then()
            //     .catch(err => {
            //         auth.signInWithEmailAndPassword(LOGIN_EMAIL, LOGIN_PASSWORD);
            //         console.log('token refresh');
            //         const _ = err;
            //     })
            //     .then(() => {
            //         db.ref(`by_username/${name}`).once('value', snapshot => {
            //             res.status(200).send({
            //                 "data": snapshot,
            //             });
            //         }, err => {
            //             console.log(err);
            //             res.status(500).send({
            //                 "error": {
            //                     "status": 500,
            //                     "title": "Internal Server Error",
            //                     "detail": errorMessage500,
            //                 }
            //             });
            //         });
            //         return;
            //     })
            //     .catch(err => {
            //         console.log(err);
            //         res.status(500).send({
            //             "error": {
            //                 "status": 500,
            //                 "title": "Internal Server Error",
            //                 "detail": errorMessage500,
            //             }
            //         });
            //     });
            // try {
            //     const token = await auth.currentUser.getIdToken(true);
            // } catch (e) {
            //     await auth.signInWithEmailAndPassword(LOGIN_EMAIL, LOGIN_PASSWORD);
            //     console.log('token refresh');
            // }
            // db.ref(`by_username/${name}`).once('value', snapshot => {
            //     res.status(200).send({
            //         "data": snapshot,
            //     });
            // }, error => {
            //     console.log(error);
            //     res.status(500).send({
            //         "error": {
            //             "status": 500,
            //             "title": "Internal Server Error",
            //             "detail": errorMessage500,
            //         }
            //     });
            // });
            break;
        }
        case 'twitterID': {
            db.ref(`by_twitter_id/${name}`).once('value', snapshot => {
                res.status(200).send({
                    "data": snapshot,
                });
            }, err => {
                console.log('ReAuth');
                const _ = err;  // Discard
                auth.signInWithEmailAndPassword(LOGIN_EMAIL, LOGIN_PASSWORD)
                    .then(() => {
                        db.ref(`by_twitter_id/${name}`).once('value', snapshot => {
                            res.status(200).send({
                                "data": snapshot,
                            });
                        }, err => {
                            console.error('Failed to get data.');
                            console.log(err);
                            res.status(500).send({
                                "error": {
                                    "status": 500,
                                    "title": "Internal Server Error",
                                    "detail": errorMessage500,
                                }
                            });
                        });
                        return;
                    })
                    .catch(err => {
                        console.error('Failed to sign in.');
                        console.log(err);
                        res.status(500).send({
                            "error": {
                                "status": 500,
                                "title": "Internal Server Error",
                                "detail": errorMessage500,
                            }
                        });
                    });
            });
            // auth.currentUser.getIdToken(true)
            //     .then()
            //     .catch(err => {
            //         auth.signInWithEmailAndPassword(LOGIN_EMAIL, LOGIN_PASSWORD);
            //         console.log('token refresh');
            //         const _ = err;
            //     });
            // try {
            //     const token = await auth.currentUser.getIdToken(true);
            // } catch (e) {
            //     await auth.signInWithEmailAndPassword(LOGIN_EMAIL, LOGIN_PASSWORD);
            //     console.log('token refresh');
            // }
            // db.ref(`by_twitter_id/${name}`).once('value', snapshot => {
            //     res.status(200).send({
            //         "data": snapshot,
            //     });
            // }, error => {
            //     console.log(error);
            //     res.status(500).send({
            //         "error": {
            //             "status": 500,
            //             "title": "Internal Server Error",
            //             "detail": errorMessage500,
            //         }
            //     });
            // });
            break;
        }
        default: {
            res.status(400).send({
                "error": {
                    "status": 400,
                    "title": "Bad Request",
                    "detail": errorMessage400,
                }
            });
        }
    }
});

app.get('*', (req, res) => {
    res.status(400).send({
        "error": "Bad Request",
        "message": errorMessage400,
    });
});

const api = functions.https.onRequest(app);
module.exports = { api };
