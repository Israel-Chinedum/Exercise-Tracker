import express from 'express';
import {v4 as uuidv4} from 'uuid';
import cors from 'cors';
import fs from 'fs';
import { users } from './get_routes/api_users.js';
import { apiUsersLogs } from './get_routes/api_users_logs.js';
import { apiUsers } from './post_routes/api_users.js';
import { apiUsersExercises } from './post_routes/api_users_exercises.js';



const app = express();
const port = 3200 || process.env.PORT;

app.listen(port, () => console.log(`Now listening on port ${port}`));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/ || /^\d{4}-\d{2}-\d{2}$/;

//GET ROUTES
users(app, fs);
apiUsersLogs(app, dateRegex, fs);

//POST ROUTES
apiUsers(app, fs, uuidv4);
apiUsersExercises(app, dateRegex, fs);


app.use((err, req, res, next) => {
    res.status(400).json(err.message)
    console.log(err.message);
});

