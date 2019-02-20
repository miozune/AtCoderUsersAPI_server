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
'Invalid request.';

const errorMessage404 =
'Using invalid URL. '
+ 'Usage: /api/info/[query]/[name] '
+ 'Query: --username:search by username --TwitterID:search by TwitterID '
+ 'Name: the name you want '
+ 'Example: `/api/info/username/tourist`';

const errorMessage500 =
'Error occured in server. Please report to admin. '
+ 'Twitter: @miozune, GitHub: https://github.com/miozune/AtCoderUsersAPI_server';

const response_error = (res, status_code) => {
    if (status_code === 400) {
        res.status(400).json({
            "error": {
                "status": 400,
                "title": "Bad Request",
                "detail": errorMessage400,
            }
        });
    } else if (status_code === 404) {
        res.status(404).json({
            "error": {
                "status": 404,
                "title": "Not Found",
                "detail": errorMessage404,
            }
        });
    } else if (status_code === 500) {
        res.status(500).json({
            "error": {
                "status": 500,
                "title": "Internal Server Error",
                "detail": errorMessage500,
            }
        });
    }
};


app.get('/info/:query/:name', (req, res) => {
    const query = req.params.query.toLowerCase();
    const name = req.params.name;

    const paths = {
        "username": `by_username/${name}`,
        "twitterid": `by_twitter_id/${name}`,
    };

    // Googleさんasync/awaitに対応してくださいなのです
    if (paths[query]) {
        if (!name.match(/[^a-zA-Z0-9_]/g)) {
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
                            console.error(err);
                            response_error(res, 500);
                        });
                        return;
                    })
                    .catch(err => {
                        console.error('Failed to sign in.');
                        console.error(err);
                        response_error(res, 500);
                    });
            });
        } else {
            // Invalid Name
            response_error(res, 400);
        }
    } else {
        // Invalid Query
        response_error(res, 404);
    }

});

app.get('/all/:query', (req, res) => {
    const query = req.params.query.toLowerCase();
    const methods = req.query;

    const paths = {
        "username": `by_username`,
        "twitterid": `by_twitter_id`,
    };

    if (paths[query]) {
        // Valid Query
        let db_ref = db.ref(paths[query]);
        if (Object.keys(methods).length > 1) {
            response_error(res, 400);
        } else {
            for (const status of ['rank', 'birth_year', 'rating', 'highest_rating', 'competitions', 'wins']) {
                if (methods[status]) {
                    db_ref = db_ref.orderByChild(status);
                    if (Number(methods[status]['start'])) db_ref = db_ref.startAt(Number(methods[status]['start']));
                    if (Number(methods[status]['end'])) db_ref = db_ref.endAt(Number(methods[status]['end']));
                }
            }
            for (const status of ['country', 'formal_country_name', 'crown', 'user_color', 'affiliation']) {
                if (methods[status]) db_ref = db_ref.orderByChild(status).equalTo(methods[status]);
            }
        }
        db_ref.once('value', snapshot => {
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
                        console.error(err);
                        response_error(res, 500);
                    });
                    return;
                })
                .catch(err => {
                    console.error('Failed to sign in.');
                    console.error(err);
                    response_error(res, 500);
                });
        });
    } else {
        // Invalid Query
        response_error(res, 404);
    }

});

app.get('*', (req, res) => {
    response_error(res, 404);
});


const api = functions.https.onRequest(app);
module.exports = { api };
