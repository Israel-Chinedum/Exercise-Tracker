export const exercises = (app, userModel, dateRegex) => {
    app.post('/api/users/:_id/exercises', async (req, res) => {
        console.log('A connection was made!')
        //DATE VALIDATION
        let date;
        if(!req.body['date']){
            date = new Date().toDateString();
        } else if(!dateRegex.test(req.body['date'])){
            return res.json({error: 'Invalid date format!'});
        } else{
            date = new Date(req.body['date']).toDateString();
        }

        //DESCRIPTION VALIDATION
        if(!req.body['description']){
            return res.json({error: 'description is required!'});
        } else if(typeof req.body['description'] !== 'string'){
            return res.json({error: 'description must be a string'});
        }

        //DURATION VALIDATION
        if(!req.body['duration']){
            return res.json({error: 'duration is required!'});
        } else if(isNaN(req.body['duration'])){
            return res.json({error: 'duration must be a number'});
        }

        //INSERT DATA INTO USERS LOG IN THE DTABASE

        //find user and retreive user all user exercise logs then store then in the exercise array
        const { description, duration } = req.body;
       
        try{
            const user = await userModel.findById(req.params._id);
            if(!user){
                res.json({error: "User does not exist!"});
            } else{
                const exercise = [...user.log, {
                    description,
                    duration: Number(duration),
                    date
                }];

                await userModel.updateOne({_id: req.params._id}, {log: exercise, count: exercise.length}).then(() =>{
                    res.json({
                        username: user.username,
                        description,
                        duration: Number(duration), 
                        date,
                        _id: user._id
                    });
                    console.log("exercise has been added!");
                })
            }
        } catch(err){
            console.error(err);
            res.json("An error occured!");
        }
       
    });
}