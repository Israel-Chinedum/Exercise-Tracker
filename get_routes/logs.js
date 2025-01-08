export const log = (app, userModel, dateRegex) => {
    app.get('/api/users/:_id/logs', async (req, res) => {

        //GET ALL LOGS OF A PARTICULAR USER
        try{
        
                const user = await userModel.findById(req.params._id);
                if(!user){
                    res.json({error: "user does not exist!"});
                } else{
                
                    const { from, to, limit } = req.query;
                    let dateList;

                    const getLogs = () => {

                        if(from && !to){
                          if(!dateRegex.test(from)){
                            return 'invalid date format!';                            
                          }
                          return user.log.filter(obj => new Date(obj.date) >= new Date(from));
                        }

                        if(to && !from){
                            if(!dateRegex.test(to)){
                                return 'invalid date format!';                                
                              }
                            return user.log.filter(obj => new Date(obj.date) <= new Date(to));
                        }

                        if(to && from){
                            if(!dateRegex.test(from) || !dateRegex.test(to)){
                                return 'invalid date format!';                                
                              }
                            return user.log.filter(obj => new Date(obj.date) <= new Date(to) && new Date(obj.date) >= new Date(from));
                        }

                        return user.log;
                    }

                    if(limit){
                        if(limit < user.log.length){
                            dateList = [...getLogs().slice(-Number(limit))];
                        }
                    } else{
                        dateList = [...getLogs()];
                    }

                    if(dateList == 'invalid date format!'){
                        res.json({error: 'invalid date format!'});
                    } else{
                        res.json({
                            username: user.username,
                            count: dateList.length,
                            _id: user._id,
                            log: dateList
                        });
                    }
                   
                }

        } catch(err){
            console.error(err);
            res.json('An error occured!');
        }
       
        
    })
}