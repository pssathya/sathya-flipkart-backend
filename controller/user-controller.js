import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import User from '../model/userSchema.js';
import SuperSecret from '../config.js';

export const getAllUsers = async (request, response) => {
    try {
        const users = await User.find({});

        response.status(200).json(users);
    } catch (error) {
        response.status(500).json('Error: ', error.message);
    }
}

async function getLoginUser(uname) {
    let user = await User.findOne({ username: uname });
    if (!user) {
        user = await User.findOne({ email: uname });
        if (!user) {
            user = await User.findOne({ phone: uname });
        }
    }
    return user;
}

export const userLogIn = async (request, response) => {
    try {
        const uname = request.body.username;
        const pwd = request.body.password;
        let user = await getLoginUser(uname);
        if (user) {
            const isPassValid = bcrypt.compareSync(request.body.password, user.password);
            if (!isPassValid)
                return response.status(401).json({ auth: false, token: 'Invalid Password' });
            // in case both match 
            let token = jwt.sign({ id: user._id, firstname: user.firstname }, SuperSecret.secret, { expiresIn: 86400 }); //24 hours
            return response.status(200).json({ auth: true, token: token });
        }
        else {
            return response.status(401).json({ auth: false, token: 'No User Found' });
        }
    } catch (error) {
        response.status(500).json('Error: ', error.message);
    }
}

export const userInfo = async (request, response) => {
    try {
        const token = request.headers['x-access-token'];

        if (!token) response.status(400).json({ auth: false, token: 'No Token Provided' });

        jwt.verify(token, SuperSecret.secret, (err, user) => {

            if (err) return response.status(500).json({ auth: false, token: 'Invalid Token' });

            User.findById(user.id, (err, result) => {

                if (err) return response.status(500).json(err);

                response.status(200).json(result);
            })
        })
    } catch (error) {
        response.status(500).json('Error: ', error.message);
    }
}

export const userSignUp = async (request, response) => {
    try {
        const uname = request.body.username;

        const exist = await User.findOne({ username: uname });
        if (exist) {
            return response.status(401).json({ message: 'User already exist' });
        }
        //encrypt Password
        let hashPassword = bcrypt.hashSync(request.body.password, 8);

        const user = request.body;
        user.password = hashPassword;
        const newUser = new User(user);
        await newUser.save();

        const userObj = await User.findOne({ username: uname });
        let token = jwt.sign({ id: userObj._id, firstname: user.firstname }, SuperSecret.secret, { expiresIn: 86400 }); //24 hours
        return response.status(200).json({ auth: true, token: token });

    } catch (error) {
        response.status(500).json({ message: error.message });
    }
}