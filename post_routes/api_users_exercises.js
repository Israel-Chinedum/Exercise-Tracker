export const apiUsersExercises = (app, dateRegex, fs) => {
    app.post('/api/users/:_id/exercises', (req, res) => {
    console.log(req.body)
    let date;

    if(!dateRegex.test(req.body['date'])){
        date = new Date().toDateString();
    } else{
        date = new Date(req.body['date']).toDateString();
    }

    const data = JSON.parse(fs.readFileSync('./users.json'));
    console.log('Former Data:', data);
    for(let i of data){
        if(i._id == req.params._id){
            i.count++;
            i.log.push({
                date,
                duration: Number(req.body['duration']),
                description: req.body['description']
            })
        }
    }

    console.log(data);

    fs.writeFile('./users.json', JSON.stringify(data), err => {
        if(err) throw err;
        for(let i of data){
            if(i._id == req.params._id){
                res.json({
                    _id: i._id,
                    username: i.username,
                    date,
                    duration: Number(req.body['duration']),
                    description: req.body['description']
                });
            }
        }
    });

 

  
});
}