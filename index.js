import express from 'express';
import dotenv from 'dotenv';

import Connection from './database/db.js';
import InsertDefaultData from './insertProductsToMongoDb.js';

const app = express();

dotenv.config();

const PORT = process.env.PORT || 8000;

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

Connection(username, password, dbName);

app.listen(PORT, () => console.log(`Server is running successfully on PORT ${PORT}`));

InsertDefaultData();
