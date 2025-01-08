import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { users } from './post_routes/users.js';
import { getUsers } from './get_routes/get_users.js';
import { exercises } from './post_routes/exercises.js';
import { log } from './get_routes/logs.js';

//CONNECT TO DATABASE
mongoose.connect('mongodb+srv://fastarfavour:fastar081@exercise-tracker.m17rk.mongodb.net/Exercise_Tracker?retryWrites=true&w=majority&appName=Exercise-Tracker')
.then(() => console.log('Database connected!'));

//DATABASE SCHEMA
const userSchema = mongoose.Schema({
    username: String,
    _id: String,
    count: Number,
    log: Array
});

//DATABASE MODEL
const userModel = mongoose.model('users', userSchema);

//SETUP EXPRESS SERVER
const app = express();
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//CONFIGURE PORT
const port = 3200 || process.env.PORT;
//LISTEN FOR INCOMING REQUESTS
app.listen(port, () => console.log(`Now listening on port ${port}`));

//REGEX FOR DATE
const dateRegex =  /^\d{4}-\d{2}-\d{2}$/;

//POST ROUTE HANDLERS
users(app, crypto, userModel);
exercises(app, userModel, dateRegex);

//GET ROUTE HANDLERS
getUsers(app, userModel);
log(app, userModel, dateRegex);