import express from 'express';
import {v4 as uuidv4} from 'uuid';
import cors from 'cors';
import fs from 'fs';

const app = express();
const port = 3200 || process.env.PORT;

app.listen(port, () => console.log(`Now listening on port ${port}`));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.get('/api/users', (req, res) => {
    const resData = [];
    if(fs.existsSync('./users.json')){
        const data = JSON.parse(fs.readFileSync('./users.json'));
        for(let i of data){
                resData.push({username: i.username, _id: i._id});
        }
        res.json(resData);
    } else{
        res.json(resData);
    }
});

app.get('/api/users/:_id/logs', (req, res) => {

    const data = JSON.parse(fs.readFileSync('./users.json'));
    for(let i of data){
        if(i._id == req.params._id){
            res.json(i);
            console.log(i);
            return
        }
    }

    res.json({error: "user does not exist!"});

});

app.post('/api/users', (req, res) => {
    console.log(req.body);
    const id = uuidv4();
    if(!fs.existsSync('users.json')){
        const data = [{
            username: req.body['username'],
            count: 0,
            _id: id,
            log: []
        }]
        fs.writeFile('./users.json', JSON.stringify(data), err => {
            if(err) throw err;
        });
    } else{
        try{
            const data = fs.readFileSync('./users.json');
            const jsonData = JSON.parse(data);
            jsonData.push( {
                username: req.body['username'],
                count: 0,
                _id: id,
                log: []
            });
            fs.writeFile('./users.json', JSON.stringify(jsonData), err =>{
                if(err) throw err;
            })
        } catch(error){
            console.error(error);
        }
       
    }

    res.json({"username": `${req.body['username']}`, "_id": `${id}`});
     
});


app.post('/api/users/:_id/exercises', (req, res) => {

    const data = JSON.parse(fs.readFileSync('./users.json'));
    console.log('Former Data:', data);
    for(let i of data){
        if(i._id == req.params._id){
            i.count++;
            i.log.push({
                description: req.body['description'],
                duration: req.body['duration'],
                date: req.body['date'] || new Date().toDateString()
            })
        }
    }

    console.log(data);

    fs.writeFile('./users.json', JSON.stringify(data), err => {
        if(err) throw err;
        for(let i of data){
            if(i._id == req.params._id){
                res.json({
                    username: i.username,
                    description: req.body['description'],
                    duration: req.body['duration'],
                    date: req.body['date'] || new Date().toDateString(),
                    _id: i._id
                });
            }
        }
    });

 

  
});


app.use((err, req, res, next) => {
    res.status(400).json(err.message)
    console.log(err.message);
});

