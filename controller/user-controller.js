import User from '../model/userSchema.js';

export const userLogIn = async (request, response) => {
    try {
        const uname = request.body.username;
        const pwd = request.body.password;
        let user = await User.findOne({ username: uname, password: pwd });
        if (user) {
            return response.status(200).json({ data : user});
        } else {
            let userEmailObj = await User.findOne({ email: uname, password: pwd });
            if (userEmailObj) {
                return response.status(200).json({ data : userEmailObj});
            } else {
                let userPhoneObj = await User.findOne({ phone: uname, password: pwd });
                if (userPhoneObj) {
                    return response.status(200).json({ data : userPhoneObj});
                } else {
                    return response.status(401).json('Invalid Login');
                }
            }
        }

    } catch (error) {
        response.json('Error: ', error.message);
    }
}

export const userSignUp = async (request, response) => {
    try {
        const exist = await User.findOne({ username: request.body.username });
        if (exist) {
            return response.status(401).json({ message: 'User already exist' });
        }
        const user = request.body;
        const newUser = new User(user);
        await newUser.save();
        response.status(200).json({ mesage: user });

    } catch (error) {
        response.status(500).json({ message: error.message });
    }
}