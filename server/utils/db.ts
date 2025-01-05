import mongoose from 'mongoose';
require('dotenv').config();

const dbUrl: string = process.env.DB_URL || '';

const connnectDB = async () => {
    try {
        await mongoose.connect(dbUrl).then((data: any) => {
    console.log(`Database is connected with ${data.connection.host}`)
        })
    } catch (error:any) {
        
        console.log(error.message);
        setTimeout(connnectDB, 5000);
    }

}

export default connnectDB;