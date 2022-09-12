import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import Connection from './database/db.js';
import InsertDefaultData from './insertProductsToMongoDb.js';
import Routes from './routes/route.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8000;

app.get('/', function (req, res) {
  res.send("Welcome to 'sathya-flipkart-backend' APIs");
});

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;
const DBNAME = process.env.DB_NAME;

const URL = process.env.MONGODB_URI || `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.fka2rkz.mongodb.net/${DBNAME}?retryWrites=true&w=majority`;

Connection(URL);

app.listen(PORT, () => console.log(`Server is running successfully on PORT ${PORT}`));

InsertDefaultData();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/', Routes);