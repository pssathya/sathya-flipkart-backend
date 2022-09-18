import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 8000;

export const USERNAME = process.env.DB_USERNAME;
export const PASSWORD = process.env.DB_PASSWORD;
export const DBNAME = process.env.DB_NAME;
export const MONGODB_URI = process.env.MONGODB_URI;

export const PAYTM_MID = process.env.PAYTM_MID;
export const PAYTM_MERCHANT_KEY = process.env.PAYTM_MERCHANT_KEY;
export const PAYTM_WEBSITE = process.env.PAYTM_WEBSITE;
export const PAYTM_CHANNEL_ID = process.env.PAYTM_CHANNEL_ID;
export const PAYTM_INDUSTRY_TYPE_ID = process.env.PAYTM_INDUSTRY_TYPE_ID;
export const PAYTM_CALLBACK_URL = process.env.PAYTM_CALLBACK_URL;

export const CLIENT_URL = process.env.CLIENT_URL;

export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const SuperSecret = {
    'secret':'SuperSecret'
}

export default SuperSecret;