export const users = (app, fs) => {
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
}