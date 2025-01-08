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

        //find user and retreive user all user exercise logs then store them in the exercise array
        //as well as get response data and store it in the userExerciseData variable
        let exercise = [];
        let userExerciseData;
        await userModel.find({_id: req.params._id}).then(user => {
            exercise = [...user[0]['log']]; 
            // userExerciseData = {
            //     username: user[0]['username'],
            //     description: req.body['description'],
            //     duration: Number(req.body['duration']),
            //     date,
            //     _id: req.params._id
            // }
        }).catch(err => {
            console.error(err);
            res.json({error: 'Invalid id!'});
        })

        //push current exercise into the exercise array
        exercise.push({
            description: req.body['description'],
            duration: Number(req.body['duration']),
            date
        });

        //update the users log with the updated use log containing the current exercise
        //as well as send back userExerciseData as response to client after making sure that the user has been updated with the current exercise
        await userModel.updateOne({_id: req.params._id}, {log: exercise}).then(() => {
            console.log('exercise has been added!');
            res.json(userExerciseData);
        }).catch(err => {
            console.error(err);
        });
    });
}