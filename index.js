import express from 'express';
import bodyParser from 'body-parser';
import { search } from './search.js';
import cors from 'cors'
const app = express();

const router = express.Router()

app.use(cors())

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', router)

app.get('/', (req, res) => {
    res.send('Choo Choo! Welcome to your Express app 🚅');
})


router.post('/search', (req, res) => {
    res.send({name : 'Post API'})
    let data = req.body;
    res.send('Data Received: ' + JSON.stringify(data));
  })

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})