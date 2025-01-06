import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
const port = 3200 || process.env.PORT;

app.listen(port, () => console.log(`Now listening on port ${port}`));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.get('', (req, res) => {
    res.json('connection verified');
})

app.post('/api/users', (req, res) => {
    console.log(req.body);
    const username = req.body['username'];
    if(!fs.existsSync('users.json')){
        fs.writeFile('./users.json', `[{"username": "${username}"}]`, err => {
            if(err) throw err;
        });
    } else{
        try{
            const data = fs.readFileSync('./users.json');
            const jsonData = JSON.parse(data);
            jsonData.push(req.body);
            console.log(jsonData);
            fs.writeFile('./users.json', JSON.stringify(jsonData), err =>{
                if(err) throw err;
            })
        } catch(error){
            console.error(error);
        }
       
    }

    res.json('recieved data!');
     
});


app.use((err, req, res, next) => {
    res.status(400).json(err.message)
    console.log(err.message);
})

