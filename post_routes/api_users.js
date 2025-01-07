export const apiUsers = (app, fs, uuidv4) => {
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
    
        res.json({username: `${req.body['username']}`, _id: `${id}`});
         
    });
}
