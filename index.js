import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuid } from 'uuid';

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

export let paytmParams = {};
paytmParams['MID'] = process.env.PAYTM_MID,
paytmParams['WEBSITE'] = process.env.PAYTM_WEBSITE,
paytmParams['CHANNEL_ID'] = process.env.PAYTM_CHANNEL_ID,
paytmParams['INDUSTRY_TYPE_ID'] = process.env.PAYTM_INDUSTRY_TYPE_ID,
paytmParams['ORDER_ID'] = uuid(),
paytmParams['CUST_ID'] = process.env.PAYTM_CUST_ID,
paytmParams['TXN_AMOUNT'] = '100',
paytmParams['CALLBACK_URL'] = process.env.PAYTM_CALLBACK_URL,
paytmParams['EMAIL'] = process.env.MY_EMAIL,
paytmParams['MOBILE_NO'] = '1234567852'

export let PAYTM_MID=process.env.PAYTM_MID;
export let PAYTM_WEBSITE=process.env.PAYTM_WEBSITE;
export let PAYTM_CHANNEL_ID=process.env.PAYTM_CHANNEL_ID;
export let PAYTM_INDUSTRY_TYPE_ID=process.env.PAYTM_INDUSTRY_TYPE_ID;
export let PAYTM_CUST_ID=process.env.PAYTM_CUST_ID;
export let PAYTM_MERCHANT_KEY=process.env.PAYTM_MERCHANT_KEY;
export let PAYTM_CALLBACK_URL=process.env.PAYTM_CALLBACK_URL;
export let MY_EMAIL=process.env.MY_EMAIL;