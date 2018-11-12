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

    const paths = {
        "username": `by_username/${name}`,
        "twitterID": `by_twitter_id/${name}`,
    };

    // Googleさんasync/awaitに対応してくださいなのです
    if (paths[query]) {
        // Valid Query
        db.ref(paths[query]).once('value', snapshot => {
            res.status(200).json({
                "data": snapshot,
            });
        }, err => {
            console.log('ReAuth');
            const _ = err;  // Discard
            auth.signInWithEmailAndPassword(LOGIN_EMAIL, LOGIN_PASSWORD)
                .then(() => {
                    db.ref(paths[query]).once('value', snapshot => {
                        res.status(200).json({
                            "data": snapshot,
                        });
                    }, err => {
                        console.error('Failed to get data.');
                        console.log(err);
                        res.status(500).json({
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
                    res.status(500).json({
                        "error": {
                            "status": 500,
                            "title": "Internal Server Error",
                            "detail": errorMessage500,
                        }
                    });
                });
        });
    } else {
        // Invalid Query
        res.status(400).json({
            "error": {
                "status": 400,
                "title": "Bad Request",
                "detail": errorMessage400,
            }
        });
    }

});

app.get('*', (req, res) => {
    res.status(400).json({
        "error": "Bad Request",
        "message": errorMessage400,
    });
});

const api = functions.https.onRequest(app);
module.exports = { api };
