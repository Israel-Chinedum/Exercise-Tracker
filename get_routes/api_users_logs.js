export const apiUsersLogs = (app, dateRegex, fs) => {
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
    
}