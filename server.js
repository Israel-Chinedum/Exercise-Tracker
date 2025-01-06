import express from 'express';

const app = express();
const port = 3000 || process.env.PORT;

app.listen(port, () => console.log(`Now listening on port 3 ${port}`));

app.use(express.urlencoded({extended: false}));

app.post('/api/users', (req, res) => {
    
})