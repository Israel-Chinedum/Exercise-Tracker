export const getUsers = (app, userModel) => {
    app.get('/api/users', async (req, res) => {
        const allUsers = [];
        await userModel.find().then(users => {
            for(let i of users){
                allUsers.push({username: i.username, _id: i._id});
            }
        });

        res.json(allUsers);
    });
}