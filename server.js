import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
const port = 3000 || process.env.PORT;

app.listen(port, () => console.log(`Now listening on port ${port}`));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());


app.get('', (req, res) => {
    console.log('something happened!');
    res.json('hmm connection got through!');
})

app.post('/api/users', (req, res) => {
    console.log(req.body);
    const username = req.body['username'];
    if(!fs.existsSync('users.json')){
        fs.writeFile('./users.json', `[{"username": "${username}"}]`, err => {
            if(err) throw err;
        });
    } else{
        let allUsernames = [];
        fs.readFileSync('./users.json', (err, data) => {
            if(err) throw err;
        })
    }

    res.json('recieved data!');
     
});

