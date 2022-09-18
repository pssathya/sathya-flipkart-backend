import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieSession from 'cookie-session';

import Connection from './database/db.js';
import InsertDefaultData from './insertProductsToMongoDb.js';
import Routes from './routes/route.js';
import passportGithub2 from 'passport-github2';
import passport from 'passport';
import {
  PORT, USERNAME, PASSWORD, DBNAME, MONGODB_URI,
  CLIENT_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
} from './config.js';

const app = express();

app.get('/', function (req, res) {
  res.send("Welcome to 'sathya-flipkart-backend' APIs");
});

const URL = MONGODB_URI || `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.fka2rkz.mongodb.net/${DBNAME}?retryWrites=true&w=majority`;

Connection(URL);

app.listen(PORT, () => console.log(`Server is running successfully on PORT ${PORT}`));

InsertDefaultData();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(
  cors({
    origin: CLIENT_URL,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use('/', Routes);

app.use(passport.initialize());
app.use(passport.session());

const GithubStrategy = passportGithub2.Strategy;

passport.use(
  new GithubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "/api/oauth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

