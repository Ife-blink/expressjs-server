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
    res.send('this is the server for the Grant finder application 🚅');
})


router.post('/search', async (req, res) => {
    let data = req.body;
    let response = await search(`${data.category}`, `${data.description}`, `${data.duration}`, `${data.teamsize}`, `${data.blockchain}`, `${data.traction}`)
    res.send(JSON.stringify(response[0]));
  })

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})