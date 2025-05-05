export const mongoose = require('mongoose');
// const configObj = require('../config/config').default;
import configObj from '../config/config';


const connectDB = () => {
    let dbConnectionsStart = 0;
    return async () => {
        try {
            if (dbConnectionsStart > 0) {
                console.warn('MongoDB connection already started');
                return;
            }
            await mongoose.connect(configObj.DB_URI);
            console.log('MongoDB connection SUCCESS');
            dbConnectionsStart++;
        } catch (error) {
            console.error('MongoDB connection FAIL and error = ', error);
            process.exit(1);
        }
    }
}

export const connect = connectDB();