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

const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/ || /^\d{4}-\d{2}-\d{2}$/;

app.get('/api/users/:_id/logs', (req, res) => {


    const data = JSON.parse(fs.readFileSync('./users.json'));

    if(req.query == {}){
        for(let i of data){
            if(i._id == req.params._id){
                res.json(i);
                console.log(i);
                return;
            }
        }
        res.json({error: "user does not exist!"});
    } else {

        const getDatesInbetween = (startDate = '', endDate = '', limit = '') => {
                const  dates = [],
                       from = new Date(startDate),
                       to = new Date(endDate);

            for(let i of data){
                if(i._id == req.params._id){
                    for(let x of i.log){
                        dates.push(x.date);
                    }
                }
            }

            console.log(dates);

           

            if(startDate != '' && endDate == '' && limit == ''){
                
               if(dateRegex.test(startDate)){
                return dates.filter(date => new Date(date) >= from);
               } else{
                return "Invalid date format!";
               }
            }

            if(startDate != '' && endDate != '' && limit == ''){
                if(dateRegex.test(startDate) && dateRegex.test(endDate)){
                    console.log(dates.filter(date => new Date(date) >= from && new Date(date) <= to))
                    return dates.filter(date => new Date(date) >= from && new Date(date) <= to);
                } else{
                    return "Invalid date format!";
                }
            }

            if(startDate != '' && endDate != '' && limit != ''){
                if(dateRegex.test(startDate) && dateRegex.test(endDate) && !isNaN(limit)){
                    const returnData = [ ...dates.filter(date => new Date(date) >= from && new Date(date) <= to)];
                    console.log(returnData);
                    if(limit >= returnData.length){
                        return returnData;
                    } else{
                        return returnData.slice(-limit);
                    }
                } else if(isNaN(limit)){
                    return "limit must be of type number!";
                } else{
                    return "Invalid date format!"
                }
            }

            if(startDate == '' && endDate == '' && limit != ''){
                if(!isNaN(limit)){
                    if(limit >= dates.length){
                        return dates;
                    } else{
                        return dates.slice(-limit);
                    }
                } else{
                    return "limit must be of type number!";
                }
            }

            if(startDate == '' && endDate != '' && limit != ''){
                if(dateRegex.test(endDate) && !isNaN(limit)){
                    const returnData = dates.filter(date => new Date(date) <= to);
                    if(limit >= returnData){
                        return returnData;
                    } else {
                        return returnData.slice(-limit);
                    }
                } else if(isNaN(limit)){
                    return "limit must be of type number!"
                } else{
                    return "Invalid date format!";
                }
            }

            if(startDate == '' && endDate != '' && limit == ''){
                if(dateRegex.test(endDate)){
                    return dates.filter(date => new Date(date) <= to);
                } else{
                    return "Invalid date format!";
                }
            }
    
            return dates;
        
        }
    
        const dateList = getDatesInbetween(req.query.from, req.query.to, req.query.limit); 

        for(let i of data){
            if(i._id == req.params._id){
               res.json({
                username: i.username,
                count: dateList.length,
                _id: i._id,
                log: i.log.filter(exercise => dateList.includes(exercise.date))
               });
               return;
            }
        }
        res.json({error: "user does not exist!"});
    }

   

})

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

    if(dateRegex.test(req.body['date'])){

        const data = JSON.parse(fs.readFileSync('./users.json'));
    console.log('Former Data:', data);
    for(let i of data){
        if(i._id == req.params._id){
            i.count++;
            i.log.push({
                description: req.body['description'],
                duration: Number(req.body['duration']),
                date: new Date(req.body['date']).toDateString() || new Date().toDateString()
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
                    duration: Number(req.body['duration']),
                    date: new Date(req.body['date']).toDateString() || new Date().toDateString(),
                    _id: i._id
                });
            }
        }
    });

    } else{
        res.json("Invalid date format!");
    }
  
});


app.use((err, req, res, next) => {
    res.status(400).json(err.message)
    console.log(err.message);
});

