export const users = (app, crypto, userModel) => {
    app.post('/api/users', (req, res) => {
        const id = crypto.randomBytes(12).toString('hex');
        if(!req.body['username']){
            res.json({error: "username is required!"});
        } else {
            userModel({
                username: req.body['username'],
                _id: id,
                count: 0,
                log: []
            }).save().then(() => {
                res.json({
                    username: req.body['username'],
                    _id: id
                });
            }).catch(err => {
                console.error(err);
            });
        }
    })
}