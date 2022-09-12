import mongoose from 'mongoose';

const Connection = async (username, password, dbName) => {
    
    const URL = `mongodb+srv://${username}:${password}@cluster0.fka2rkz.mongodb.net/${dbName}?retryWrites=true&w=majority`;
    try {
        await mongoose.connect(URL, { useUnifiedTopology: true, useNewUrlParser: true });
        console.log('Database Connected Succesfully');
    } catch(error) {
        console.log('Error while connecting with the database : ', error.message);
    }
};

export default Connection;